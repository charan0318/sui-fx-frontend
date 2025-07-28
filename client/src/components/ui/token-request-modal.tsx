import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Droplets, CheckCircle, XCircle, Copy, ExternalLink, Loader2 } from "lucide-react";

const faucetRequestSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{64}$/, "Invalid SUI wallet address format"),
});

type FaucetRequestForm = z.infer<typeof faucetRequestSchema>;

interface TokenRequestModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TokenRequestModal({ open, onOpenChange }: TokenRequestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [lastTransaction, setLastTransaction] = useState<any>(null);

  const form = useForm<FaucetRequestForm>({
    resolver: zodResolver(faucetRequestSchema),
    defaultValues: {
      walletAddress: "",
    },
  });

  const requestTokensMutation = useMutation({
    mutationFn: async (data: FaucetRequestForm) => {
      return apiRequest("POST", "/api/faucet/request", data);
    },
    onSuccess: (data) => {
      setLastTransaction({ success: true, data, message: "Tokens sent successfully!" });
      form.reset();
      toast({
        title: "Success!",
        description: "SUI tokens have been sent to your wallet.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to process token request";
      setLastTransaction({ success: false, message: errorMessage });
      toast({
        title: "Request Failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard.",
    });
  };

  const onSubmit = (data: FaucetRequestForm) => {
    requestTokensMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/95 border-gray-700 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white font-space-grotesk">
            <Droplets className="w-6 h-6 text-blue-400 mr-3" />
            Request Testnet Tokens
          </DialogTitle>
          <DialogDescription className="text-gray-300 font-inter">
            Enter your SUI wallet address to receive 0.1 SUI testnet tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!lastTransaction && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 font-inter">Wallet Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="0x1234567890abcdef..."
                            {...field}
                            className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 pr-10 font-mono"
                            disabled={requestTokensMutation.isPending}
                          />
                          {field.value && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              {form.formState.errors.walletAddress ? (
                                <XCircle className="w-5 h-5 text-red-400" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              )}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300 font-inter">Amount per request:</span>
                  <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
                    0.1 SUI
                  </Badge>
                </div>

                <Button
                  type="submit"
                  disabled={requestTokensMutation.isPending}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-6 text-lg transition-all duration-300 font-space-grotesk"
                >
                  {requestTokensMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-5 h-5" />
                      <span>Request Tokens</span>
                    </div>
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Transaction Result */}
          {lastTransaction && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className={`p-4 rounded-lg border ${
                lastTransaction.success 
                  ? 'bg-green-500/10 border-green-500/30' 
                  : 'bg-red-500/10 border-red-500/30'
              }`}>
                <div className="flex items-center mb-2">
                  {lastTransaction.success ? (
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-400 mr-2" />
                  )}
                  <span className={`font-semibold font-space-grotesk ${
                    lastTransaction.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {lastTransaction.success ? 'Transaction Successful' : 'Transaction Failed'}
                  </span>
                </div>
                <p className="text-gray-300 font-inter text-sm">{lastTransaction.message}</p>
              </div>

              {lastTransaction.success && lastTransaction.data && (
                <div className="space-y-3">
                  {/* Transaction Hash */}
                  <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <span className="text-sm text-gray-400 font-inter">Transaction Hash:</span>
                      <p className="font-mono text-sm text-white break-all">
                        {lastTransaction.data.transactionHash}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(lastTransaction.data.transactionHash)}
                      className="ml-2 shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Explorer Link */}
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:text-white hover:bg-white/10 font-space-grotesk"
                    onClick={() => window.open(lastTransaction.data.explorerUrl, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Explorer
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full text-gray-400 hover:text-white font-inter"
                    onClick={() => {
                      setLastTransaction(null);
                      form.reset();
                    }}
                  >
                    Request More Tokens
                  </Button>
                </div>
              )}

              {!lastTransaction.success && (
                <Button
                  variant="ghost"
                  className="w-full text-gray-400 hover:text-white font-inter"
                  onClick={() => setLastTransaction(null)}
                >
                  Try Again
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}