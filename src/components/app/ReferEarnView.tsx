import React, { useState, useEffect } from 'react';
import { ArrowLeft, Gift, Share2, Copy, Check, Users, Zap, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReferEarnViewProps {
  onBack: () => void;
  onUpgrade: () => void;
}

export default function ReferEarnView({ onBack, onUpgrade }: ReferEarnViewProps) {
  const [referralCode, setReferralCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    bonusQuestionsEarned: 0,
    friendsJoined: 0,
  });

  useEffect(() => {
    // Generate referral code from localStorage user data or use fallback
    const generateReferralCode = () => {
      try {
        const userDataStr = localStorage.getItem('user_data');
        if (userDataStr) {
          const userData = JSON.parse(userDataStr);
          const userId = userData.id || userData.uid || '';
          if (userId) {
            const randomChars = userId
              .replace(/[^a-zA-Z0-9]/g, '')
              .substring(0, 6)
              .toUpperCase();
            return `GRAH${randomChars}`;
          }
        }
      } catch (e) {
        // Silently fail and use fallback
      }
      // Fallback: generate random code
      const randomChars = Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();
      return `GRAH${randomChars}`;
    };

    setReferralCode(generateReferralCode());
  }, []);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = async () => {
    const shareText = `Join me on GrahAI and get 3 bonus AI questions! Use code ${referralCode} to sign up.\n\nExplore personalized Kundli readings and astrology insights.`;
    const shareUrl = `https://grahai.app/signup?ref=${referralCode}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join GrahAI - Get Bonus Questions',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  } as const

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" as const },
    },
  } as const

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 px-4 py-3 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/[0.04]">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/[0.08] rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold">Refer & Earn</h1>
      </div>

      <motion.div
        className="max-w-2xl mx-auto px-4 py-6 pb-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <div className="w-16 h-16 bg-amber-400/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-amber-400/20">
            <Gift className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold mb-2">Invite Friends, Earn Rewards</h2>
          <p className="text-white/60">
            Share your unique referral code and both you and your friends get bonus AI questions
          </p>
        </motion.div>

        {/* Referral Code Section */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 mb-6"
        >
          <p className="text-white/60 text-sm mb-3">Your Referral Code</p>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 rounded-lg bg-white/[0.05] border border-white/[0.08] font-mono text-lg font-semibold text-amber-400">
              {referralCode}
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-3 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 transition-colors flex items-center gap-2 text-amber-400"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span className="text-sm">Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Share Button */}
        <motion.button
          variants={itemVariants}
          onClick={handleShare}
          className="w-full py-3 rounded-xl bg-amber-400 text-black font-semibold flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors mb-8"
        >
          <Share2 className="w-5 h-5" />
          Share Referral Link
        </motion.button>

        {/* How It Works */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">How It Works</h3>
          <div className="space-y-3">
            {[
              {
                step: 1,
                title: 'Share Your Link',
                description: 'Send your unique referral code to friends',
              },
              {
                step: 2,
                title: 'Friend Signs Up',
                description: 'They create an account and build their Kundli',
              },
              {
                step: 3,
                title: 'Earn Together',
                description: 'Both get 3 bonus AI questions',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex gap-4"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-amber-400 font-semibold">{item.step}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold mb-1">{item.title}</p>
                  <p className="text-white/60 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Rewards Tracker */}
        <motion.div variants={itemVariants} className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Your Rewards</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: 'Total Referrals',
                value: stats.totalReferrals,
                icon: Users,
              },
              {
                label: 'Bonus Questions',
                value: stats.bonusQuestionsEarned,
                icon: Zap,
              },
              {
                label: 'Friends Joined',
                value: stats.friendsJoined,
                icon: Gift,
              },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-amber-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-amber-400">{stat.value}</p>
                  <p className="text-white/60 text-xs mt-1">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Your Referrals Section */}
        <motion.div
          variants={itemVariants}
          className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-8 text-center mb-8"
        >
          <div className="w-12 h-12 bg-white/[0.05] rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-white/40" />
          </div>
          <h3 className="font-semibold mb-2">No Referrals Yet</h3>
          <p className="text-white/60 text-sm">
            Start sharing your code to see your referrals appear here
          </p>
        </motion.div>

        {/* CTA Section */}
        <motion.div variants={itemVariants}>
          <div className="rounded-xl bg-gradient-to-br from-amber-400/10 to-amber-400/5 border border-amber-400/20 p-6">
            <h3 className="font-semibold mb-2">Unlimited Referral Rewards</h3>
            <p className="text-white/60 text-sm mb-4">
              Upgrade to Pro to unlock unlimited referral rewards and share your code with everyone
            </p>
            <button
              onClick={onUpgrade}
              className="w-full py-2 rounded-lg bg-amber-400 text-black font-semibold flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
