import { Card } from "@/components/ui/card";

interface WelcomeBannerProps {
  userName: string;
}

export const WelcomeBanner = ({ userName }: WelcomeBannerProps) => {
  return (
    <Card className="mb-6 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
      <div className="p-6">
        <h1 className="text-3xl font-bold text-foreground">
          Xin chào, {userName}!
        </h1>
        <p className="text-muted-foreground mt-2">
          Chào mừng bạn đến với cổng thông tin cư dân
        </p>
      </div>
    </Card>
  );
};