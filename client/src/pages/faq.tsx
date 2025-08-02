import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { 
  HelpCircle, 
  ArrowLeft, 
  Book,
  Activity,
  Shield,
  Droplets,
  Rocket,
  Zap
} from "lucide-react";
import logoFm from "@/components/background/logo_fm.png";
import suiFxVideo from "@/components/background/sui_fx_center.mp4";


const faqs = [
  {
    question: "What is a testnet?",
    answer: "A testnet is an instance of a blockchain used specifically for testing. In contrast to a mainnet blockchain, which represents a production environment, testnets allow developers to test their apps and smart contracts without risking assets with real-world value. Testnet tokens are assets that can be freely obtained from testnet faucets to experiment with funds flows on testnets."
  },
  {
    question: "How can I get SUI testnet tokens?",
    answer: "You can use our SUI-FX Testnet Faucet to obtain free SUI testnet tokens. Simply visit the faucet page, enter your SUI wallet address, and request tokens. The tokens will be sent instantly to your wallet for development and testing purposes."
  },
  {
    question: "What's the difference between mainnet and testnet SUI?",
    answer: "Mainnet SUI has real-world value and is used for actual transactions on the Sui blockchain. Testnet SUI has no real-world value and is used purely for development, testing, and experimentation. Never use testnet tokens for production applications."
  },
  {
    question: "Which networks does this faucet support?",
    answer: "This faucet currently supports SUI testnet. We provide access to testnet SUI tokens that can be used across all SUI testnet environments and applications for development and testing purposes."
  },
  {
    question: "How much SUI can I get from this faucet?",
    answer: "Developers can request 0.1 SUI testnet tokens per hour, per wallet address. This rate limiting ensures fair distribution and prevents abuse. If you need more tokens for extensive testing, please contact our support team."
  },
  {
    question: "Why am I seeing an error message of 'Limit Exceeded'?",
    answer: "This means you have exceeded the rate limit and need to wait before making another request. Our faucet allows 1 request per hour per wallet address and 100 requests per hour per IP address. Wait for the cooldown period to expire before trying again."
  },
  {
    question: "How do I create a SUI wallet address?",
    answer: "You can create a SUI wallet using various wallet providers like Sui Wallet, Ethos Wallet, or Suiet. Download the wallet extension or app, create a new wallet, and copy your wallet address (starting with 0x) to use with our faucet."
  },
  {
    question: "What can I do with testnet SUI tokens?",
    answer: "Testnet SUI tokens can be used to interact with smart contracts, test DApps, practice transactions, deploy and test your own smart contracts, and experiment with the Sui blockchain without any real-world financial risk."
  },
  {
    question: "Is there a registration required to use the faucet?",
    answer: "No registration is required! Our faucet is completely permissionless and public. Simply visit the faucet page, enter your SUI wallet address, and request tokens. No account creation or KYC process is needed."
  },
  {
    question: "How long does it take to receive tokens?",
    answer: "Testnet SUI tokens are sent instantly to your wallet address once you submit a valid request. The transaction should appear in your wallet within a few seconds to a minute, depending on network conditions."
  },
  {
    question: "What should I do if I don't receive my tokens?",
    answer: "If you don't receive your tokens after a few minutes, please check: 1) Your wallet address is correct and formatted properly, 2) You're connected to the SUI testnet, 3) You haven't exceeded the rate limits. If issues persist, contact our support team with your transaction details."
  },
  {
    question: "Can I use testnet tokens on mainnet?",
    answer: "No, testnet tokens cannot be used on mainnet and have no real-world value. They exist only on the testnet environment for development and testing purposes. Never attempt to transfer testnet tokens to mainnet addresses."
  }
];

export default function FAQ() {
  // Get system stats
  const { data: stats } = useQuery<any>({
    queryKey: ["/api/stats"],
    refetchInterval: 30000,
  });

  const navItems = [
    { name: 'Home', url: '/', icon: ArrowLeft },
    { name: 'Faucet', url: '/faucet', icon: Droplets },
    { name: 'APIs', url: '/api-clients', icon: Shield },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Status', url: '/status', icon: Activity }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-100"
        >
          <source src={suiFxVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-black/20 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* Navigation */}
      <NavBar items={navItems} />

      {/* Main Content */}
      <div className="relative z-10 pt-16">
        {/* Status Indicator */}
        <div className="fixed top-6 right-6 z-50">
          <Badge variant="outline" className="border-green-500/50 text-green-400 bg-black/20 backdrop-blur-sm">
            {stats?.success ? 'Online' : 'Loading...'}
          </Badge>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            {/* Back Link */}
            <div className="mb-6">
              <a 
                href="/" 
                className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-inter"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </a>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-space-grotesk mb-4">
              <span className="bg-gradient-to-r from-white via-blue-300 to-purple-300 bg-clip-text text-transparent">
                Frequently Asked
              </span>
              <br />
              <span className="text-gray-200">Questions</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-inter">
              Everything you need to know about the SUI-FX Testnet Faucet
            </p>
          </motion.div>

          {/* FAQ Grid */}
          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={2}
                    className="rounded-xl"
                  />
                  <Card className="bg-black/30 border-gray-700/50 backdrop-blur-xl hover:bg-black/40 transition-all duration-300 relative z-10">
                    <CardHeader>
                      <CardTitle className="flex items-start text-white font-space-grotesk text-lg">
                        <HelpCircle className="w-6 h-6 text-blue-400 mr-3 mt-1 flex-shrink-0" />
                        {faq.question}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 leading-relaxed font-inter ml-9">
                        {faq.answer}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="text-center mt-16"
          >
            <Card className="bg-black/30 border-gray-700 backdrop-blur-xl max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold font-space-grotesk text-white mb-4">
                  Still have questions?
                </h3>
                <p className="text-gray-300 font-inter mb-6">
                  Can't find the answer you're looking for? Our support team is here to help.
                </p>
                <div className="flex justify-center">
                  <div className="relative">
                    <GlowingEffect 
                      blur={15}
                      spread={30}
                      variant="default"
                      glow={true}
                      className="w-48 h-12 rounded-full"
                      disabled={false}
                    />
                    <a 
                      href="https://discord.gg/your-discord-link"
                      className="bg-black/80 backdrop-blur-sm w-48 h-12 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-base font-semibold leading-6 text-white inline-block hover:bg-gray-900/80 transition-all duration-300 flex items-center justify-center"
                    >
                      <span className="absolute inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      </span>
                      <div className="relative flex justify-center w-full text-center h-full items-center z-10 rounded-full bg-black/90 py-0.5 px-4 ring-1 ring-white/10">
                        <span className="text-base font-space-grotesk bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-300 to-purple-300">
                          Contact Us
                        </span>
                      </div>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="container mx-auto px-8 py-8 flex items-center justify-between"
        >
          <img 
            src={logoFm} 
            alt="FM Logo" 
            className="w-12 h-12 opacity-80"
          />
          <p className="text-gray-400 font-inter text-sm flex-1 text-center">
            Built with 🤍 from ch04niverse
          </p>
          <a 
            href="https://docs.sui.io/guides/developer/getting-started/connect"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-black/20 border border-white/10 backdrop-blur-sm rounded-lg text-white/80 hover:text-white hover:bg-black/30 transition-all duration-300 text-sm font-inter"
          >
            Build with Sui
          </a>
        </motion.div>
      </div>
    </div>
  );
}