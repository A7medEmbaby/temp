// src/app/components/dashboard/service-requests/print.service.ts
import { Injectable } from '@angular/core';
import { ServiceRequest } from './service-request.model';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  constructor() {}

  // Make these methods public so they can be accessed by the print preview
  createCustomerCardHTML(serviceRequest: ServiceRequest): string {
    if (!serviceRequest?.customer) {
      return '<div class="error-message">بيانات العميل غير متوفرة</div>';
    }

    // Get all devices for display
    const devices = serviceRequest.devices || [];
    
    let deviceInfo = '';
    if (devices.length === 0) {
      deviceInfo = `
        <div class="info-group">
          <label>الأجهزة:</label>
          <span>لا توجد أجهزة</span>
        </div>
      `;
    } else if (devices.length === 1) {
      const device = devices[0];
      deviceInfo = `
        <div class="info-group">
          <label>نوع الجهاز:</label>
          <span>${device.device?.deviceType ?? 'غير معروف'}</span>
        </div>
        <div class="info-group">
          <label>الموديل:</label>
          <span>${device.device?.model ?? 'غير معروف'}</span>
        </div>
        <div class="info-group">
          <label>تاريخ التسليم المتوقع:</label>
          <span>${device.promisedDeliveryDate ? this.formatDate(device.promisedDeliveryDate) : 'غير محدد'}</span>
        </div>
      `;
    } else {
      deviceInfo = `
        <div class="info-group">
          <label>عدد الأجهزة:</label>
          <span>${devices.length} أجهزة</span>
        </div>
        <div class="devices-summary">
          ${devices.map((device, index) => `
            <div class="device-summary-item">
              <span class="device-number">الجهاز ${index + 1}:</span>
              <span class="device-details">${device.device?.deviceType ?? 'غير معروف'} - ${device.device?.model ?? 'غير معروف'}</span>
              <span class="delivery-date">التسليم: ${device.promisedDeliveryDate ? this.formatDate(device.promisedDeliveryDate) : 'غير محدد'}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="customer-card">
        <div class="document-header">
          <div class="header-logo">
            <img src="../../assets/images/logo.png" alt="شعار الشركة" />
          </div>
          <div class="header-text">
            <h1>مؤسسة منصور علي الدوسري التجارية</h1>
            <p>لإصلاح وصيانة وتجديد وتركيب جميع أجهزة التبريد والتكييف وبيع قطع الغيار</p>
          </div>
        </div>
        <div class="card-header">
          <h2>بطاقة العميل</h2>
          <div class="customer-id">#${serviceRequest.customerId}</div>
        </div>
        <div class="card-body">
          <div class="customer-info">
            <div class="info-group">
              <label>اسم العميل:</label>
              <span>${serviceRequest.customer?.name ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>رقم الهاتف:</label>
              <span>${serviceRequest.customer?.phone ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>العنوان:</label>
              <span>${serviceRequest.customer?.address ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>تاريخ التسجيل:</label>
              <span>${this.formatDate(serviceRequest.customer?.registrationDate)}</span>
            </div>
          </div>
          <div class="request-details">
            <h3>تفاصيل الطلب</h3>
            ${deviceInfo}
            <div class="info-group">
              <label>حالة الطلب:</label>
              <span class="${this.getStatusClass(serviceRequest.status)}">${serviceRequest.status ?? 'غير محدد'}</span>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <div class="request-info">
            <div>رقم الطلب: #${serviceRequest.requestId}</div>
            <div>تاريخ الطلب: ${this.formatDate(serviceRequest.requestDate)}</div>
          </div>
        </div>
      </div>
    `;
  }

  createDeviceStickerHTML(serviceRequest: ServiceRequest, deviceIndex: number = 0): string {
    const devices = serviceRequest.devices || [];
    
    if (devices.length === 0) {
      return '<div class="error-message">لا توجد أجهزة في هذا الطلب</div>';
    }

    const device = devices[deviceIndex];
    if (!device) {
      return '<div class="error-message">الجهاز المحدد غير موجود</div>';
    }

    return `
      <div class="device-sticker">
        <div class="document-header">
          <div class="header-logo">
            <img src="../../assets/images/logo.png" alt="شعار الشركة" />
          </div>
          <div class="header-text">
            <h1>مؤسسة منصور علي الدوسري التجارية</h1>
            <p>لإصلاح وصيانة وتجديد وتركيب جميع أجهزة التبريد والتكييف وبيع قطع الغيار</p>
          </div>
        </div>
        <div class="sticker-header">
          <div class="sticker-title">ملصق الجهاز</div>
          <div class="request-id">#${serviceRequest.requestId}</div>
        </div>
        <div class="sticker-body">
          <div class="device-info">
            <div class="info-group">
              <label>نوع الجهاز:</label>
              <span>${device.device?.deviceType ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>الموديل:</label>
              <span>${device.device?.model ?? 'غير معروف'}</span>
            </div>
            ${devices.length > 1 ? `
            <div class="info-group">
              <label>الجهاز:</label>
              <span>${deviceIndex + 1} من ${devices.length}</span>
            </div>
            ` : ''}
          </div>
          <div class="customer-info">
            <div class="info-group">
              <label>اسم العميل:</label>
              <span>${serviceRequest.customer?.name ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>رقم الهاتف:</label>
              <span>${serviceRequest.customer?.phone ?? 'غير معروف'}</span>
            </div>
          </div>
        </div>
        <div class="sticker-footer">
          <div class="date-info">
            <div>تاريخ الاستلام: ${this.formatDate(serviceRequest.requestDate)}</div>
            <div>تاريخ التسليم المتوقع: ${device.promisedDeliveryDate ? this.formatDate(device.promisedDeliveryDate) : 'غير محدد'}</div>
          </div>
          <div class="barcode">
            *${serviceRequest.requestId}-${deviceIndex + 1}*
          </div>
        </div>
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line">توقيع العميل</div>
          </div>
        </div>
      </div>
    `;
  }

  createRequestSummaryHTML(serviceRequest: ServiceRequest): string {
    if (!serviceRequest) {
      return '<div class="error-message">بيانات الطلب غير متوفرة</div>';
    }

    // Calculate total costs from all devices
    let totalMaintenanceCost = 0;
    let totalInspectionCost = 0;
    let allUsedParts: any[] = [];

    const devices = serviceRequest.devices || [];
    devices.forEach(device => {
      totalMaintenanceCost += device.maintenanceCost || 0;
      totalInspectionCost += device.inspectionCost || 0;
      if (device.usedParts && device.usedParts.length > 0) {
        allUsedParts.push(...device.usedParts.map(part => ({
          ...part,
          deviceType: device.device?.deviceType,
          deviceModel: device.device?.model
        })));
      }
    });

    // Create devices section HTML
    let devicesHTML = '';
    if (devices.length > 0) {
      devicesHTML = `
        <div class="section devices-section">
          <h3>معلومات الأجهزة (${devices.length})</h3>
          <div class="devices-grid">
            ${devices.map((device, index) => `
              <div class="device-item">
                <h4>الجهاز ${index + 1}</h4>
                <div class="info-grid">
                  <div class="info-group">
                    <label>نوع الجهاز:</label>
                    <span>${device.device?.deviceType ?? 'غير معروف'}</span>
                  </div>
                  <div class="info-group">
                    <label>الموديل:</label>
                    <span>${device.device?.model ?? 'غير معروف'}</span>
                  </div>
                  <div class="info-group">
                    <label>تاريخ التسليم المتوقع:</label>
                    <span>${device.promisedDeliveryDate ? this.formatDate(device.promisedDeliveryDate) : 'غير محدد'}</span>
                  </div>
                  <div class="info-group">
                    <label>تاريخ التسليم الفعلي:</label>
                    <span>${device.actualDeliveryDate ? this.formatDate(device.actualDeliveryDate) : 'غير محدد'}</span>
                  </div>
                  <div class="info-group">
                    <label>تكلفة الصيانة:</label>
                    <span>${this.formatCurrency(device.maintenanceCost)}</span>
                  </div>
                  <div class="info-group">
                    <label>تكلفة الفحص:</label>
                    <span>${this.formatCurrency(device.inspectionCost)}</span>
                  </div>
                  ${device.missingParts ? `
                  <div class="info-group full-width">
                    <label>الأجزاء الناقصة:</label>
                    <span>${device.missingParts}</span>
                  </div>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Create parts table HTML
    let partsTableHTML = '';
    if (allUsedParts.length > 0) {
      let partsRows = '';
      let totalPartsPrice = 0;
      
      allUsedParts.forEach(part => {
        partsRows += `
          <tr>
            <td>${part.partName}</td>
            <td>${part.partNumber}</td>
            <td>${part.quantity}</td>
            <td>${this.formatCurrency(part.unitPrice)}</td>
            <td>${this.formatCurrency(part.totalPrice)}</td>
            <td>${part.deviceType} - ${part.deviceModel}</td>
          </tr>
        `;
        totalPartsPrice += part.totalPrice;
      });

      partsTableHTML = `
        <div class="section parts-section">
          <h3>قطع الغيار المستخدمة</h3>
          <table class="parts-table">
            <thead>
              <tr>
                <th>اسم القطعة</th>
                <th>رقم القطعة</th>
                <th>الكمية</th>
                <th>سعر الوحدة</th>
                <th>الإجمالي</th>
                <th>الجهاز</th>
              </tr>
            </thead>
            <tbody>
              ${partsRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="5" class="total-label">إجمالي قطع الغيار</td>
                <td class="total-value">${this.formatCurrency(totalPartsPrice)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      `;
    }

    return `
      <div class="request-summary">
        <div class="document-header">
          <div class="header-logo">
            <img src="../../assets/images/logo.png" alt="شعار الشركة" />
          </div>
          <div class="header-text">
            <h1>مؤسسة منصور علي الدوسري التجارية</h1>
            <p>لإصلاح وصيانة وتجديد وتركيب جميع أجهزة التبريد والتكييف وبيع قطع الغيار</p>
          </div>
        </div>
        <div class="header">
          <div class="title">
            <h2>تقرير طلب صيانة</h2>
            <div class="request-id">رقم الطلب: #${serviceRequest.requestId}</div>
          </div>
          <div class="status-badge ${this.getStatusClass(serviceRequest.status)}">${serviceRequest.status ?? 'غير محدد'}</div>
        </div>

        <div class="section customer-section">
          <h3>معلومات العميل</h3>
          <div class="info-grid">
            <div class="info-group">
              <label>اسم العميل:</label>
              <span>${serviceRequest.customer?.name ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>العنوان:</label>
              <span>${serviceRequest.customer?.address ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>رقم الهاتف:</label>
              <span>${serviceRequest.customer?.phone ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>تاريخ التسجيل:</label>
              <span>${this.formatDate(serviceRequest.customer?.registrationDate)}</span>
            </div>
          </div>
        </div>

        ${devicesHTML}

        <div class="section request-info-section">
          <h3>معلومات الطلب</h3>
          <div class="info-grid">
            <div class="info-group">
              <label>اسم المستلم:</label>
              <span>${serviceRequest.receptionist ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>ورشة الصيانة:</label>
              <span>${serviceRequest.maintenanceWorkshop ?? 'غير معروف'}</span>
            </div>
            <div class="info-group">
              <label>تاريخ الطلب:</label>
              <span>${this.formatDate(serviceRequest.requestDate)}</span>
            </div>
            <div class="info-group">
              <label>حالة تأكيد العميل:</label>
              <span>${serviceRequest.customerConfirmationStatus ?? 'غير محدد'}</span>
            </div>
            <div class="info-group">
              <label>تم إرسال SMS:</label>
              <span>${serviceRequest.smSsent ? 'نعم' : 'لا'}</span>
            </div>
          </div>
        </div>

        <div class="section cost-section">
          <h3>التكاليف</h3>
          <div class="cost-grid">
            <div class="info-group">
              <label>إجمالي تكلفة الصيانة:</label>
              <span>${this.formatCurrency(totalMaintenanceCost)}</span>
            </div>
            <div class="info-group">
              <label>إجمالي تكلفة الفحص:</label>
              <span>${this.formatCurrency(totalInspectionCost)}</span>
            </div>
            <div class="info-group">
              <label>معدل الضريبة:</label>
              <span>${this.formatPercent(serviceRequest.taxRate)}</span>
            </div>
            <div class="info-group">
              <label>مبلغ الضريبة:</label>
              <span>${this.formatCurrency(serviceRequest.taxAmount)}</span>
            </div>
            <div class="info-group total-cost-group">
              <label>التكلفة الإجمالية:</label>
              <span class="total-cost">${this.formatCurrency(serviceRequest.totalCost)}</span>
            </div>
          </div>
        </div>

        ${partsTableHTML}

        <div class="section notes-section">
          <h3>ملاحظات</h3>
          <div class="notes">${serviceRequest.notes ?? 'لا توجد ملاحظات'}</div>
        </div>

        ${serviceRequest.smsNotifications && serviceRequest.smsNotifications.length > 0 ? `
        <div class="section sms-section">
          <h3>إشعارات SMS</h3>
          <table class="sms-table">
            <thead>
              <tr>
                <th>رقم الهاتف</th>
                <th>الرسالة</th>
                <th>تاريخ الإرسال</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              ${serviceRequest.smsNotifications.map(sms => `
                <tr>
                  <td>${sms.phoneNumber ?? 'غير معروف'}</td>
                  <td>${sms.message ?? 'غير متوفر'}</td>
                  <td>${this.formatDate(sms.sentDate)}</td>
                  <td class="sms-status ${sms.status?.toLowerCase()}">${sms.status ?? 'غير محدد'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        ` : ''}

        <div class="footer">
          <div class="signature-section">
            <div class="signature-box">
              <div class="signature-line">توقيع المستلم</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">توقيع الفني</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">توقيع المدير</div>
            </div>
          </div>
          <div class="print-date">
            تاريخ الطباعة: ${this.getCurrentDate()}
          </div>
        </div>
      </div>
    `;
  }

  // Helper methods for formatting
  private formatDate(dateString?: string): string {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  }

  private getCurrentDate(): string {
    return new Intl.DateTimeFormat('ar-EG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());
  }

  private formatCurrency(amount?: number): string {
    if (amount === undefined || amount === null) return '0.00 ر.س';
    return new Intl.NumberFormat('ar-SA', { 
      style: 'currency', 
      currency: 'SAR' 
    }).format(amount);
  }

  private formatPercent(value?: number): string {
    if (value === undefined || value === null) return '0%';
    return new Intl.NumberFormat('ar-EG', { 
      style: 'percent', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  }

  private getStatusClass(status?: string | null): string {
    if (!status) return '';
    switch (status) {
      case 'قيد الانتظار': return 'pending';
      case 'قيد التصليح': return 'in-progress';
      case 'مكتمل': return 'completed';
      case 'ملغى': return 'cancelled';
      default: return '';
    }
  }

  // Print methods
  printCustomerCard(serviceRequest: ServiceRequest): void {
    this.printDocument('customer-card', this.createCustomerCardHTML(serviceRequest), this.getCustomerCardStyles());
  }

  printDeviceSticker(serviceRequest: ServiceRequest, deviceIndex: number = 0): void {
    this.printDocument('device-sticker', this.createDeviceStickerHTML(serviceRequest, deviceIndex), this.getDeviceStickerStyles());
  }

  printAllDeviceStickers(serviceRequest: ServiceRequest): void {
    const devices = serviceRequest.devices || [];
    if (devices.length === 0) {
      alert('لا توجد أجهزة للطباعة');
      return;
    }

    devices.forEach((_, index) => {
      setTimeout(() => {
        this.printDeviceSticker(serviceRequest, index);
      }, index * 1000); // Delay each print by 1 second
    });
  }

  printRequestSummary(serviceRequest: ServiceRequest): void {
    this.printDocument('request-summary', this.createRequestSummaryHTML(serviceRequest), this.getRequestSummaryStyles());
  }

  generatePdf(serviceRequest: ServiceRequest): void {
    try {
      // Create a new PDF document with Arabic language support
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Set right-to-left mode for Arabic
      doc.setR2L(true);

      // Add metadata
      doc.setProperties({
        title: `طلب صيانة #${serviceRequest.requestId}`,
        subject: 'تقرير طلب صيانة',
        author: 'نظام إدارة طلبات الصيانة',
        creator: 'نظام إدارة طلبات الصيانة'
      });

      // Create a canvas element to render the content
      const canvas = document.createElement('canvas');
      canvas.width = 595; // A4 width in points (72dpi)
      canvas.height = 842; // A4 height in points
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }
      
      // Set background color
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Set text properties
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      
      // Draw title
      ctx.fillText('تقرير طلب صيانة', canvas.width / 2, 50);
      
      // Draw request ID
      ctx.font = 'bold 18px Arial';
      ctx.fillText(`رقم الطلب: #${serviceRequest.requestId}`, canvas.width / 2, 80);
      
      // Draw status
      ctx.font = '16px Arial';
      ctx.fillText(`الحالة: ${serviceRequest.status ?? 'غير محدد'}`, canvas.width / 2, 110);
      
      // Add customer details section
      ctx.font = 'bold 18px Arial';
      ctx.textAlign = 'right';
      ctx.fillText('معلومات العميل', 550, 150);
      
      ctx.font = '16px Arial';
      ctx.fillText(`اسم العميل: ${serviceRequest.customer?.name ?? 'غير معروف'}`, 550, 180);
      ctx.fillText(`رقم الهاتف: ${serviceRequest.customer?.phone ?? 'غير معروف'}`, 550, 210);
      ctx.fillText(`العنوان: ${serviceRequest.customer?.address ?? 'غير معروف'}`, 550, 240);
      
      // Add device information
      const devices = serviceRequest.devices || [];
      ctx.font = 'bold 18px Arial';
      ctx.fillText('معلومات الأجهزة', 550, 280);
      
      ctx.font = '16px Arial';
      if (devices.length === 0) {
        ctx.fillText('لا توجد أجهزة', 550, 310);
      } else {
        ctx.fillText(`عدد الأجهزة: ${devices.length}`, 550, 310);
        if (devices[0]) {
          ctx.fillText(`الجهاز الأول: ${devices[0].device?.deviceType ?? 'غير معروف'}`, 550, 340);
          ctx.fillText(`الموديل: ${devices[0].device?.model ?? 'غير معروف'}`, 550, 370);
        }
      }
      
      // Add request information
      ctx.font = 'bold 18px Arial';
      ctx.fillText('معلومات الطلب', 550, 410);
      
      ctx.font = '16px Arial';
      ctx.fillText(`تاريخ الطلب: ${this.formatDate(serviceRequest.requestDate)}`, 550, 440);
      ctx.fillText(`اسم المستلم: ${serviceRequest.receptionist ?? 'غير معروف'}`, 550, 470);
      ctx.fillText(`ورشة الصيانة: ${serviceRequest.maintenanceWorkshop ?? 'غير معروف'}`, 550, 500);
      
      // Calculate total costs
      let totalMaintenanceCost = 0;
      let totalInspectionCost = 0;
      devices.forEach(device => {
        totalMaintenanceCost += device.maintenanceCost || 0;
        totalInspectionCost += device.inspectionCost || 0;
      });
      
      // Add cost information
      ctx.font = 'bold 18px Arial';
      ctx.fillText('التكاليف', 550, 540);
      
      ctx.font = '16px Arial';
      ctx.fillText(`إجمالي تكلفة الصيانة: ${this.formatCurrency(totalMaintenanceCost)}`, 550, 570);
      ctx.fillText(`إجمالي تكلفة الفحص: ${this.formatCurrency(totalInspectionCost)}`, 550, 600);
      ctx.fillText(`معدل الضريبة: ${this.formatPercent(serviceRequest.taxRate)}`, 550, 630);
      ctx.fillText(`مبلغ الضريبة: ${this.formatCurrency(serviceRequest.taxAmount)}`, 550, 660);
      ctx.fillText(`التكلفة الإجمالية: ${this.formatCurrency(serviceRequest.totalCost)}`, 550, 690);
      
      // Add signature section
      ctx.font = '16px Arial';
      ctx.fillText('توقيع المستلم: ________________', 550, 750);
      ctx.fillText('توقيع الفني: ________________', 350, 750);
      ctx.fillText('توقيع المدير: ________________', 150, 750);
      
      // Add print date at footer
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(`تاريخ الطباعة: ${this.getCurrentDate()}`, canvas.width / 2, 780);
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // Add image to PDF
      doc.addImage(imgData, 'JPEG', 0, 0, 210, 297); // A4 size in mm
      
      // If there are multiple devices, add them on additional pages
      if (devices.length > 1) {
        devices.forEach((device, index) => {
          if (index === 0) return; // Skip first device as it's already on the first page
          
          const canvas2 = document.createElement('canvas');
          canvas2.width = 595;
          canvas2.height = 842;
          const ctx2 = canvas2.getContext('2d');
          
          if (!ctx2) return;
          
          // Set background color
          ctx2.fillStyle = '#ffffff';
          ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
          
          // Draw device details
          ctx2.fillStyle = '#000000';
          ctx2.font = 'bold 24px Arial';
          ctx2.textAlign = 'center';
          ctx2.fillText(`الجهاز ${index + 1}`, canvas2.width / 2, 50);
          
          ctx2.font = 'bold 18px Arial';
          ctx2.textAlign = 'right';
          ctx2.fillText('معلومات الجهاز', 550, 100);
          
          ctx2.font = '16px Arial';
          ctx2.fillText(`نوع الجهاز: ${device.device?.deviceType ?? 'غير معروف'}`, 550, 130);
          ctx2.fillText(`الموديل: ${device.device?.model ?? 'غير معروف'}`, 550, 160);
          ctx2.fillText(`تاريخ التسليم المتوقع: ${device.promisedDeliveryDate ? this.formatDate(device.promisedDeliveryDate) : 'غير محدد'}`, 550, 190);
          ctx2.fillText(`تاريخ التسليم الفعلي: ${device.actualDeliveryDate ? this.formatDate(device.actualDeliveryDate) : 'غير محدد'}`, 550, 220);
          ctx2.fillText(`تكلفة الصيانة: ${this.formatCurrency(device.maintenanceCost)}`, 550, 250);
          ctx2.fillText(`تكلفة الفحص: ${this.formatCurrency(device.inspectionCost)}`, 550, 280);
          
          if (device.missingParts) {
            ctx2.font = 'bold 18px Arial';
            ctx2.fillText('الأجزاء الناقصة', 550, 320);
            ctx2.font = '16px Arial';
            ctx2.fillText(device.missingParts, 550, 350);
          }
          
          // Convert canvas to image
          const imgData2 = canvas2.toDataURL('image/jpeg', 1.0);
          
          // Add new page with device details
          doc.addPage();
          doc.addImage(imgData2, 'JPEG', 0, 0, 210, 297);
        });
      }
      
      // If there are used parts, add them on a new page
      const allUsedParts: any[] = [];
      devices.forEach(device => {
        if (device.usedParts && device.usedParts.length > 0) {
          allUsedParts.push(...device.usedParts.map(part => ({
            ...part,
            deviceType: device.device?.deviceType,
            deviceModel: device.device?.model
          })));
        }
      });

      if (allUsedParts.length > 0) {
        // Create new canvas for the parts page
        const canvas3 = document.createElement('canvas');
        canvas3.width = 595;
        canvas3.height = 842;
        const ctx3 = canvas3.getContext('2d');
        
        if (!ctx3) {
          throw new Error('Failed to get third canvas context');
        }
        
        // Set background color
        ctx3.fillStyle = '#ffffff';
        ctx3.fillRect(0, 0, canvas3.width, canvas3.height);
        
        // Draw parts table heading
        ctx3.fillStyle = '#000000';
        ctx3.font = 'bold 24px Arial';
        ctx3.textAlign = 'center';
        ctx3.fillText('قطع الغيار المستخدمة', canvas3.width / 2, 50);
        
        // Draw table headers
        ctx3.font = 'bold 16px Arial';
        ctx3.textAlign = 'right';
        let y = 100;
        const columnPositions = [550, 450, 350, 250, 150, 50];
        
        // Draw header row
        ctx3.fillText('اسم القطعة', columnPositions[0], y);
        ctx3.fillText('رقم القطعة', columnPositions[1], y);
        ctx3.fillText('الكمية', columnPositions[2], y);
        ctx3.fillText('سعر الوحدة', columnPositions[3], y);
        ctx3.fillText('الإجمالي', columnPositions[4], y);
        ctx3.fillText('الجهاز', columnPositions[5], y);
        
        // Draw line under headers
        ctx3.strokeStyle = '#000000';
        ctx3.lineWidth = 1;
        ctx3.beginPath();
        ctx3.moveTo(50, y + 10);
        ctx3.lineTo(550, y + 10);
        ctx3.stroke();
        
        y += 40;
        
        // Draw parts data
        ctx3.font = '14px Arial';
        let totalPartsPrice = 0;
        
        allUsedParts.forEach(part => {
          if (y <= 750) { // Check if there's space left on the page
            ctx3.fillText(part.partName ?? '', columnPositions[0], y);
            ctx3.fillText(part.partNumber ?? '', columnPositions[1], y);
            ctx3.fillText(part.quantity.toString(), columnPositions[2], y);
            ctx3.fillText(this.formatCurrency(part.unitPrice), columnPositions[3], y);
            ctx3.fillText(this.formatCurrency(part.totalPrice), columnPositions[4], y);
            ctx3.fillText(`${part.deviceType} - ${part.deviceModel}`, columnPositions[5], y);
            
            totalPartsPrice += part.totalPrice;
            
            // Draw line between rows
            ctx3.beginPath();
            ctx3.moveTo(50, y + 10);
            ctx3.lineTo(550, y + 10);
            ctx3.stroke();
            
            y += 40;
          }
        });
        
        // Draw total row
        ctx3.font = 'bold 16px Arial';
        ctx3.fillText('إجمالي قطع الغيار', columnPositions[1], y);
        ctx3.fillText(this.formatCurrency(totalPartsPrice), columnPositions[4], y);
        
        // Convert third canvas to image
        const imgData3 = canvas3.toDataURL('image/jpeg', 1.0);
        
        // Add third page with parts table
        doc.addPage();
        doc.addImage(imgData3, 'JPEG', 0, 0, 210, 297);
      }
      
      // Add notes and SMS notifications on a new page if needed
      if (serviceRequest.notes || (serviceRequest.smsNotifications && serviceRequest.smsNotifications.length > 0)) {
        // Create new canvas for the notes page
        const canvas4 = document.createElement('canvas');
        canvas4.width = 595;
        canvas4.height = 842;
        const ctx4 = canvas4.getContext('2d');
        
        if (!ctx4) {
          throw new Error('Failed to get fourth canvas context');
        }
        
        // Set background color
        ctx4.fillStyle = '#ffffff';
        ctx4.fillRect(0, 0, canvas4.width, canvas4.height);
        
        // Set text properties
        ctx4.fillStyle = '#000000';
        ctx4.textAlign = 'right';
        
        let y = 50;
        
        // Draw notes section
        if (serviceRequest.notes) {
          ctx4.font = 'bold 20px Arial';
          ctx4.fillText('ملاحظات', 550, y);
          y += 30;
          
          ctx4.font = '16px Arial';
          const notes = serviceRequest.notes ?? 'لا توجد ملاحظات';
          // Wrap text to fit width
          const words = notes.split(' ');
          let line = '';
          
          for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx4.measureText(testLine);
            if (metrics.width > 500 && i > 0) {
              ctx4.fillText(line, 550, y);
              line = words[i] + ' ';
              y += 25;
              if (y > 800) return; // Avoid going off the page
            } else {
              line = testLine;
            }
          }
          ctx4.fillText(line, 550, y);
          y += 50;
        }
        
        // Draw SMS notifications section
        if (serviceRequest.smsNotifications && serviceRequest.smsNotifications.length > 0) {
          ctx4.font = 'bold 20px Arial';
          ctx4.fillText('إشعارات SMS', 550, y);
          y += 30;
          
          ctx4.font = '14px Arial';
          serviceRequest.smsNotifications.forEach(sms => {
            ctx4.fillText(`رقم الهاتف: ${sms.phoneNumber ?? 'غير معروف'}`, 550, y);
            y += 20;
            ctx4.fillText(`الرسالة: ${sms.message ?? 'غير متوفر'}`, 550, y);
            y += 20;
            ctx4.fillText(`التاريخ: ${this.formatDate(sms.sentDate)}`, 550, y);
            y += 20;
            ctx4.fillText(`الحالة: ${sms.status ?? 'غير محدد'}`, 550, y);
            y += 30;
            
            if (y > 800) return;
          });
        }
        
        // Convert fourth canvas to image
        const imgData4 = canvas4.toDataURL('image/jpeg', 1.0);
        
        // Add fourth page with notes and SMS notifications
        doc.addPage();
        doc.addImage(imgData4, 'JPEG', 0, 0, 210, 297);
      }

      // Save the PDF
      doc.save(`request-${serviceRequest.requestId}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('حدث خطأ أثناء إنشاء ملف PDF. يرجى المحاولة مرة أخرى.');
    }
  }

  private printDocument(id: string, content: string, styles: string): void {
    // Create a new iframe
    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '-9999px';
    printFrame.style.bottom = '-9999px';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    printFrame.id = `print-frame-${id}`;
    
    // Append the iframe to the document
    document.body.appendChild(printFrame);
    
    // Get the iframe document
    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    
    if (frameDoc) {
      // Define print settings based on document type
      let printSettings = '';
      
      switch(id) {
        case 'customer-card':
          // Customer card should be printed in A5 portrait format
          printSettings = `
            @page {
              size: A5 portrait;
              margin: 5mm;
            }
            @media print {
              html, body {
                width: 148mm;
                height: 210mm;
                margin: 0;
                padding: 0;
              }
              .customer-card {
                box-shadow: none;
                border: none;
                width: 100%;
                page-break-after: avoid;
                page-break-before: avoid;
              }
              @page { margin: 5mm; }
              body { margin: 0; }
            }
          `;
          break;
          
        case 'device-sticker':
          // Device sticker should be printed with 100mm width
          printSettings = `
            @page {
              size: 100mm 150mm;
              margin: 2mm;
            }
            @media print {
              html, body {
                width: 100mm;
                height: 150mm;
                margin: 0;
                padding: 0;
              }
              .device-sticker {
                box-shadow: none;
                border: none;
                width: 100%;
                page-break-after: avoid;
                page-break-before: avoid;
              }
              @page { margin: 2mm; }
              body { margin: 0; }
            }
          `;
          break;
          
        case 'request-summary':
          // Full report should be printed on A5 paper portrait
          printSettings = `
            @page {
              size: A5 portrait;
              margin: 5mm;
            }
            @media print {
              html, body {
                width: 148mm;
                height: 210mm;
                margin: 0;
                padding: 0;
              }
              .request-summary {
                box-shadow: none;
                border: none;
                width: 100%;
                page-break-after: auto;
              }
              .section {
                page-break-inside: avoid;
              }
              .parts-section {
                page-break-before: always;
              }
              @page { margin: 5mm; }
            }
          `;
          break;
      }
      
      // Write the content to the iframe with print settings
      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>طباعة ${id}</title>
          <style>
            ${styles}
            ${printSettings}
          </style>
        </head>
        <body>
          ${content}
          <script>
            // This script sets up the window.onload event
            window.onload = function() {
              // Focus the window before printing
              window.focus();
              
              // Wait a moment for styles to be applied
              setTimeout(function() {
                // Print with specific settings
                const mediaQueryList = window.matchMedia('print');
                mediaQueryList.addListener(function(mql) {
                  if (!mql.matches) {
                    // Print dialog was closed, we can remove the iframe
                    setTimeout(function() {
                      window.frameElement && window.frameElement.remove();
                    }, 1000);
                  }
                });
                
                window.print();
              }, 500);
            };
          </script>
        </body>
        </html>
      `);
      frameDoc.close();
    }
  }

  // Styles for each document type
  getCustomerCardStyles(): string {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Tajawal', sans-serif;
      }
      
      body {
        direction: rtl;
        background-color: #f9fafb;
        padding: 5mm;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
      }
      
      .customer-card {
        width: 100%;
        max-width: 148mm;
        background: white;
        border-radius: 3mm;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        page-break-inside: avoid;
      }
      
      .document-header {
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 2px solid #1d4ed8;
      }
      
      .header-logo img {
        width: 35px;
        height: 35px;
        object-fit: contain;
        border-radius: 50%;
        background: white;
        padding: 2px;
      }
      
      .header-text {
        flex: 1;
        text-align: center;
      }
      
      .header-text h1 {
        font-size: 12px;
        font-weight: 700;
        margin: 0 0 2px 0;
        line-height: 1.2;
      }
      
      .header-text p {
        font-size: 8px;
        opacity: 0.9;
        margin: 0;
        line-height: 1.1;
      }
      
      .card-header {
        background: #f8fafc;
        color: #1e40af;
        padding: 8px 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .card-header h2 {
        font-size: 14px;
        font-weight: 700;
        margin: 0;
      }
      
      .customer-id {
        font-size: 12px;
        font-weight: 600;
        background: #1e40af;
        color: white;
        padding: 2px 6px;
        border-radius: 3px;
      }
      
      .card-body {
        padding: 10px;
        flex-grow: 1;
      }
      
      .customer-info {
        display: grid;
        grid-template-columns: 1fr;
        gap: 6px;
        margin-bottom: 12px;
      }
      
      .request-details {
        margin-top: 12px;
        border-top: 1px solid #e5e7eb;
        padding-top: 8px;
      }
      
      .request-details h3 {
        font-size: 12px;
        margin-bottom: 8px;
        color: #1e40af;
        font-weight: 600;
      }
      
      .info-group {
        display: flex;
        align-items: flex-start;
        margin-bottom: 4px;
        gap: 4px;
      }
      
      .info-group label {
        font-weight: 600;
        color: #4b5563;
        min-width: 65px;
        font-size: 10px;
        flex-shrink: 0;
      }
      
      .info-group span {
        font-size: 10px;
        color: #1f2937;
        line-height: 1.3;
      }
      
      .info-group span.pending {
        color: #b45309;
        font-weight: 600;
      }
      
      .info-group span.in-progress {
        color: #1e40af;
        font-weight: 600;
      }
      
      .info-group span.completed {
        color: #065f46;
        font-weight: 600;
      }
      
      .info-group span.cancelled {
        color: #b91c1c;
        font-weight: 600;
      }
      
      .devices-summary {
        margin-top: 8px;
        padding: 6px;
        background: #f8fafc;
        border-radius: 3px;
        border: 1px solid #e2e8f0;
      }
      
      .device-summary-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: 4px 0;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .device-summary-item:last-child {
        border-bottom: none;
      }
      
      .device-number {
        font-weight: 600;
        color: #1e40af;
        font-size: 9px;
      }
      
      .device-details {
        color: #1f2937;
        font-size: 8px;
      }
      
      .delivery-date {
        color: #6b7280;
        font-size: 8px;
        font-style: italic;
      }
      
      .card-footer {
        background-color: #f3f4f6;
        padding: 8px 10px;
        border-top: 1px solid #e5e7eb;
      }
      
      .request-info {
        display: flex;
        justify-content: space-between;
        font-size: 9px;
        color: #4b5563;
      }
      
      .error-message {
        color: #b91c1c;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      
      @media print {
        body {
          background: none;
          padding: 0;
        }
        
        .customer-card {
          box-shadow: none;
          border: 1px solid #e5e7eb;
        }
      }
    `;
  }

  getDeviceStickerStyles(): string {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Tajawal', sans-serif;
      }
      
      body {
        direction: rtl;
        background-color: #f9fafb;
        padding: 2mm;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        min-height: 100vh;
      }
      
      .device-sticker {
        width: 100mm;
        background: white;
        border-radius: 2mm;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        display: flex;
        flex-direction: column;
        page-break-inside: avoid;
      }
      
      .document-header {
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        padding: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
        border-bottom: 1px solid #1d4ed8;
      }
      
      .header-logo img {
        width: 25px;
        height: 25px;
        object-fit: contain;
        border-radius: 50%;
        background: white;
        padding: 1px;
      }
      
      .header-text {
        flex: 1;
        text-align: center;
      }
      
      .header-text h1 {
        font-size: 8px;
        font-weight: 700;
        margin: 0 0 1px 0;
        line-height: 1.1;
      }
      
      .header-text p {
        font-size: 6px;
        opacity: 0.9;
        margin: 0;
        line-height: 1;
      }
      
      .sticker-header {
        background: #f8fafc;
        color: #1e40af;
        padding: 4px 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .sticker-title {
        font-size: 10px;
        font-weight: 700;
      }
      
      .request-id {
        font-size: 10px;
        font-weight: 600;
        background: #1e40af;
        color: white;
        padding: 1px 4px;
        border-radius: 2px;
      }
      
      .sticker-body {
        padding: 6px;
        display: grid;
        grid-template-columns: 1fr;
        gap: 6px;
      }
      
      .device-info, .customer-info {
        display: flex;
        flex-direction: column;
        gap: 3px;
      }
      
      .info-group {
        display: flex;
        align-items: flex-start;
        gap: 3px;
      }
      
      .info-group label {
        font-weight: 600;
        color: #4b5563;
        font-size: 8px;
        min-width: 35px;
        flex-shrink: 0;
      }
      
      .info-group span {
        font-size: 8px;
        color: #1f2937;
        font-weight: 500;
        line-height: 1.2;
      }
      
      .sticker-footer {
        background-color: #f3f4f6;
        padding: 4px 6px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
      }
      
      .date-info {
        font-size: 7px;
        color: #4b5563;
        line-height: 1.2;
      }
      
      .barcode {
        font-family: 'Courier New', monospace;
        font-size: 10px;
        letter-spacing: 1px;
        font-weight: bold;
        text-align: center;
        background: white;
        padding: 2px;
        border: 1px solid #000;
      }
      
      .signature-section {
        padding: 6px;
        border-top: 1px solid #e5e7eb;
      }
      
      .signature-box {
        display: flex;
        justify-content: center;
        margin-top: 8px;
      }
      
      .signature-line {
        border-top: 1px solid #9ca3af;
        padding-top: 4px;
        text-align: center;
        color: #4b5563;
        font-size: 8px;
        width: 70%;
      }
      
      .error-message {
        color: #b91c1c;
        text-align: center;
        padding: 20px;
        font-size: 14px;
      }
      
      @media print {
        body {
          background: none;
          padding: 0;
        }
        
        .device-sticker {
          box-shadow: none;
          border: 1px solid #e5e7eb;
        }
      }
    `;
  }

  getRequestSummaryStyles(): string {
    return `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap');
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        font-family: 'Tajawal', sans-serif;
      }
      
      body {
        direction: rtl;
        background-color: #f9fafb;
        padding: 5mm;
      }
      
      .request-summary {
        max-width: 148mm;
        margin: 0 auto;
        background: white;
        border-radius: 3mm;
        overflow: hidden;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .document-header {
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        padding: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        border-bottom: 2px solid #1d4ed8;
      }
      
      .header-logo img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 50%;
        background: white;
        padding: 2px;
      }
      
      .header-text {
        flex: 1;
        text-align: center;
      }
      
      .header-text h1 {
        font-size: 14px;
        font-weight: 700;
        margin: 0 0 2px 0;
        line-height: 1.2;
      }
      
      .header-text p {
        font-size: 9px;
        opacity: 0.9;
        margin: 0;
        line-height: 1.1;
      }
      
      .header {
        background: #f8fafc;
        color: #1e40af;
        padding: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
      }
      
      .title {
        text-align: center;
      }
      
      .title h2 {
        font-size: 16px;
        margin-bottom: 3px;
        font-weight: 700;
      }
      
      .request-id {
        font-size: 12px;
        opacity: 0.8;
      }
      
      .status-badge {
        font-size: 10px;
        font-weight: 600;
        padding: 3px 8px;
        border-radius: 10px;
        background: white;
        color: black;
      }
      
      .status-badge.pending {
        background: #fffbeb;
        color: #b45309;
      }
      
      .status-badge.in-progress {
        background: #eff6ff;
        color: #1e40af;
      }
      
      .status-badge.completed {
        background: #ecfdf5;
        color: #065f46;
      }
      
      .status-badge.cancelled {
        background: #fef2f2;
        color: #b91c1c;
      }
      
      .section {
        padding: 8px;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .section:last-child {
        border-bottom: none;
      }
      
      .section h3 {
        font-size: 12px;
        color: #1f2937;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 3px;
        font-weight: 600;
      }
      
      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
      }
      
      .info-group {
        margin-bottom: 4px;
      }
      
      .info-group.full-width {
        grid-column: 1 / -1;
      }
      
      .info-group label {
        display: block;
        color: #6b7280;
        font-size: 9px;
        margin-bottom: 2px;
        font-weight: 500;
      }
      
      .info-group span {
        color: #1f2937;
        font-weight: 500;
        font-size: 9px;
        line-height: 1.2;
      }
      
      .info-group span.total-cost {
        color: #047857;
        font-weight: 700;
        font-size: 11px;
      }
      
      .cost-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 6px;
        background: #f9fafb;
        padding: 6px;
        border-radius: 4px;
      }
      
      .total-cost-group {
        grid-column: 1 / -1;
        background: #f0f9ff;
        padding: 6px;
        border-radius: 3px;
        border: 1px solid #bae6fd;
      }
      
      .devices-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 8px;
      }
      
      .device-item {
        background: #f9fafb;
        padding: 6px;
        border-radius: 4px;
        border: 1px solid #e5e7eb;
      }
      
      .device-item h4 {
        color: #1e40af;
        margin-bottom: 6px;
        font-size: 10px;
        font-weight: 600;
      }
      
      .notes, .missing-parts {
        background: #f9fafb;
        padding: 6px;
        border-radius: 4px;
        color: #4b5563;
        min-height: 30px;
        white-space: pre-line;
        font-size: 9px;
        line-height: 1.3;
      }
      
      .parts-table, .sms-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 8px;
      }
      
      .parts-table th, .parts-table td,
      .sms-table th, .sms-table td {
        padding: 4px;
        text-align: right;
        border-bottom: 1px solid #e5e7eb;
      }
      
      .parts-table th, .sms-table th {
        background: #f3f4f6;
        color: #374151;
        font-weight: 600;
        font-size: 8px;
      }
      
      .parts-table tbody tr:nth-child(even),
      .sms-table tbody tr:nth-child(even) {
        background-color: #f9fafb;
      }
      
      .parts-table tfoot {
        font-weight: 700;
      }
      
      .parts-table .total-label {
        text-align: left;
        color: #4b5563;
      }
      
      .parts-table .total-value {
        color: #047857;
      }
      
      .sms-status {
        padding: 1px 3px;
        border-radius: 2px;
        font-weight: 600;
        font-size: 7px;
      }
      
      .sms-status.delivered {
        background: #ecfdf5;
        color: #065f46;
      }
      
      .sms-status.pending {
        background: #fffbeb;
        color: #b45309;
      }
      
      .sms-status.failed {
        background: #fef2f2;
        color: #b91c1c;
      }
      
      .footer {
        background: #f3f4f6;
        padding: 8px;
        border-top: 1px solid #e5e7eb;
      }
      
      .signature-section {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      
      .signature-box {
        width: 30%;
      }
      
      .signature-line {
        border-top: 1px solid #9ca3af;
        padding-top: 4px;
        text-align: center;
        color: #4b5563;
        font-size: 8px;
      }
      
      .print-date {
        text-align: center;
        color: #6b7280;
        font-size: 7px;
      }
      
      .error-message {
        color: #b91c1c;
        text-align: center;
        padding: 15px;
        font-size: 14px;
      }
      
      @media print {
        body {
          background: none;
          padding: 0;
        }
        
        .request-summary {
          box-shadow: none;
          border-radius: 0;
        }
        
        .section {
          page-break-inside: avoid;
        }
        
        .parts-section, .sms-section {
          page-break-before: always;
        }
      }
    `;
  }
}