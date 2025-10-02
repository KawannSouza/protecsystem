import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Heart, Activity, Target } from "lucide-react";

interface Metric {
  value: number;
  label: string;
  Icon: React.ElementType;
  iconColor?: string;
}

interface WorkerStatusCardProps {
  name: string;
  role: string;
  avatarSrc: string;
  avatarFallback: string;
  metrics: [Metric, Metric, Metric];
  status: string;
}

export function WorkerStatusCard({
  name,
  role,
  avatarSrc,
  avatarFallback,
  metrics,
  status,
}: WorkerStatusCardProps) {
  return (
    <Card className="w-[350px] bg-zinc-800 text-white border-zinc-700 shadow-lg hover:scale-105 transition">
      
      <CardHeader className="flex flex-row items-center gap-2 pb-1">
        <Avatar className="w-12 h-12 border-2 border-indigo-500 shadow">
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <p className="font-bold text-lg">{name}</p>
          <p className="text-sm text-zinc-400">{role}</p>
        </div>
      </CardHeader>

      <CardContent className="flex justify-between items-center px-6 py-1">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <metric.Icon size={20} className={metric.iconColor || "text-zinc-300"} />
            <span className="text-2xl font-semibold">{metric.value}</span>
            <span className="text-xs text-zinc-400">{metric.label}</span>
          </div>
        ))}
      </CardContent>
      
      <CardFooter className="pb-1 px-6">
        <p className="text-sm font-medium">{status}</p>
      </CardFooter>
    </Card>
  );
}