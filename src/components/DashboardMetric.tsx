import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface MetricProps {
  title: string;
  value: number | string;
}

export default function DashboardMetric({ title, value }: MetricProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-sm text-gray-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
