import { IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import upiQrCode from "@/assets/upi-qr-code.jpeg";

interface UpiPaymentDialogProps {
  variant?: "default" | "outline" | "card";
  className?: string;
}

const UpiPaymentDialog = ({ variant = "default", className = "" }: UpiPaymentDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === "card" ? (
          <div className={`p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all ${className}`}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Pay via UPI</p>
                <p className="text-sm text-muted-foreground">Quick & secure payment</p>
              </div>
            </div>
          </div>
        ) : (
          <Button variant={variant === "outline" ? "outline" : "default"} className={`border-primary/30 hover:bg-primary/10 ${className}`}>
            <IndianRupee className="h-4 w-4 mr-2 text-primary" />
            <span className="text-primary font-medium">Pay via UPI</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-display">Pay via UPI</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <p className="text-2xl font-bold text-foreground">UNITY GLOBAL TOURS</p>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="font-semibold text-primary">UPI ID:</span>
            <a 
              href="upi://pay?pa=unityglobaltours@idfcbank" 
              className="text-primary hover:underline"
            >
              unityglobaltours@idfcbank
            </a>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Scan this QR code with any UPI app to transfer
          </p>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <img 
              src={upiQrCode} 
              alt="Unity Global Tours UPI QR Code" 
              className="w-64 h-64 object-contain"
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>Powered by</span>
            <span className="font-semibold text-red-600">IDFC FIRST Bank</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpiPaymentDialog;
