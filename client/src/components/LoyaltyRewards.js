import { useState } from "react";


import "./LoyaltyRewards.css";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card.js";
import { Button } from "./ui/button.js";
import { Badge } from "./ui/badge.js";
import { Progress } from "./ui/progress.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog.js";

import { 
  Flame,
  Gift,
  Star,
  Trophy,
  Sparkles,
  TrendingUp,
  Percent,
  Calendar,
  Target,
  Award,
  CheckCircle,
  Clock
} from "lucide-react";

import { toast } from "sonner";

const loyaltyTiers = [
  { name: "Bronze", minPoints: 0, maxPoints: 499, benefits: ["5% discount"], color: "bronze", icon: "🥉" },
  { name: "Silver", minPoints: 500, maxPoints: 999, benefits: ["10% discount"], color: "silver", icon: "🥈" },
  { name: "Gold", minPoints: 1000, maxPoints: 1999, benefits: ["15% discount"], color: "gold", icon: "🥇" },
  { name: "Platinum", minPoints: 2000, maxPoints: Infinity, benefits: ["20% discount"], color: "platinum", icon: "💎" }
];

export function LoyaltyRewards({
  currentPoints,
  pointHistory,
  availableDeals,
  rewardHistory,
  onBack,
  onRedeemDeal
}) {
  const [selectedTab, setSelectedTab] = useState("deals");

  return (
    <div className="loyalty-page">

      {/* HEADER */}
      <div className="loyalty-header">
        <div className="loyalty-container">

          <Button variant="ghost" onClick={onBack} className="loyalty-back">
            ← Back
          </Button>

          <div className="loyalty-header-top">
            <div className="loyalty-title-box">
              <div className="loyalty-title-row">
                <Flame className="icon-lg" />
                <h1 className="loyalty-title">Loyalty & Rewards</h1>
              </div>
              <p className="loyalty-subtitle">Earn points and unlock rewards</p>
            </div>

            {/* POINTS CARD */}
            <Card className="loyalty-points-card">
              <CardContent>
                <div className="points-value">{currentPoints}</div>
                <p className="points-label">Total Points</p>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="loyalty-container loyalty-main">

        {/* TIERS */}
        <Card className="tier-card">
          <CardHeader>
            <CardTitle className="inline-flex gap-2">
              <Trophy />
              Membership Tiers
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="tier-grid">
              {loyaltyTiers.map((tier) => (
                <div key={tier.name} className={`tier-box ${tier.color}`}>
                  <div className="tier-icon">{tier.icon}</div>
                  <h3 className="tier-name">{tier.name}</h3>
                  <p className="tier-range">
                    {tier.minPoints}{tier.maxPoints === Infinity ? "+" : `-${tier.maxPoints}`} points
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TABS */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="tabs">
            <TabsTrigger value="deals">Point Deals</TabsTrigger>
            <TabsTrigger value="history">Point History</TabsTrigger>
            <TabsTrigger value="rewards">My Rewards</TabsTrigger>
          </TabsList>

          {/* DEALS */}
          <TabsContent value="deals">
            <div className="deals-grid">
              {availableDeals.map((deal) => (
                <Card key={deal.id} className="deal-card">
                  <div className="deal-image">
                    <img src={deal.image} />
                  </div>

                  <CardContent>
                    <h3 className="deal-title">{deal.title}</h3>
                    <p className="deal-description">{deal.description}</p>

                    <Button className="deal-btn" onClick={() => onRedeemDeal(deal.id)}>
                      Redeem
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* HISTORY */}
          <TabsContent value="history">
            <div className="history-grid">
              {pointHistory.earned.map((entry, i) => (
                <Card key={i} className="history-card">
                  <CardContent>
                    <div className="history-title">{entry.source}</div>
                    <div className="history-amount">+{entry.amount}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* REWARDS */}
          <TabsContent value="rewards">
            <div className="rewards-grid">
              {rewardHistory.map((r) => (
                <Card key={r.id} className="reward-card">
                  <CardContent>
                    <h4>{r.title}</h4>
                    <p className="reward-date">{r.redeemedOn}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
