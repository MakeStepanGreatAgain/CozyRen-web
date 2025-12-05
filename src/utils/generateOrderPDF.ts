import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';
import type { CartItem } from "@/components/cart/CartContext";

interface OrderData {
  orderNumber: string;
  items: CartItem[];
  totalPrice: number;
  itemsCount: number;
  contactData: {
    name: string;
    phone: string;
    email: string;
    comment: string;
  };
  deliveryType: string;
  deliveryData?: {
    address: string;
    entrance: string;
    floor: string;
    apartment: string;
    date: string;
    time: string;
  };
  paymentMethod: string;
}

export const generateOrderPDF = async (orderData: OrderData) => {
  try {
    // Find the checkout container div
    const checkoutContainer = document.querySelector('.container.mx-auto.px-4.py-8') as HTMLElement;
    
    if (!checkoutContainer) {
      throw new Error('Checkout container not found');
    }

    // Create canvas from the checkout div
    const canvas = await html2canvas(checkoutContainer, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: checkoutContainer.scrollWidth,
      height: checkoutContainer.scrollHeight,
      scrollX: 0,
      scrollY: 0
    });

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Calculate scale to fit width and maintain aspect ratio
    const scale = pdfWidth / canvasWidth;
    const scaledHeight = canvasHeight * scale;
    
    // If scaled height exceeds page height, we might need multiple pages
    if (scaledHeight <= pdfHeight) {
      // Single page
      pdf.addImage(
        canvas.toDataURL('image/jpeg', 0.8),
        'JPEG',
        0,
        0,
        pdfWidth,
        scaledHeight
      );
    } else {
      // Multiple pages
      let yOffset = 0;
      const pageHeight = pdfHeight;
      
      while (yOffset < scaledHeight) {
        const sourceY = yOffset / scale;
        const sourceHeight = Math.min(pageHeight / scale, canvasHeight - sourceY);
        
        // Create a temporary canvas for this page section
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = sourceHeight;
        
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(
            canvas,
            0, sourceY, canvasWidth, sourceHeight,
            0, 0, canvasWidth, sourceHeight
          );
          
          if (yOffset > 0) {
            pdf.addPage();
          }
          
          pdf.addImage(
            tempCanvas.toDataURL('image/jpeg', 0.8),
            'JPEG',
            0,
            0,
            pdfWidth,
            sourceHeight * scale
          );
        }
        
        yOffset += pageHeight;
      }
    }

    // Save the PDF
    pdf.save(`order-${orderData.orderNumber}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Не удалось создать PDF');
  }
};