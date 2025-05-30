// src/app/components/dashboard/service-requests/view-service-request/view-service-request.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceRequestsService } from '../service-requests.service';
import { ServiceRequest, UsedPart } from '../service-request.model';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PrintService } from '../print.service';
import { PrintPreviewDialogComponent, PrintPreviewDialogData } from '../print-preview-dialog/print-preview-dialog.component';
import { 
  faPrint, 
  faArrowLeft, 
  faEdit, 
  faUser, 
  faLaptop, 
  faClipboardList, 
  faStickyNote, 
  faExclamation, 
  faTools, 
  faCheckCircle, 
  faTimesCircle,
  faExclamationTriangle,
  faIdCard,
  faTag,
  faFileAlt,
  faFilePdf
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';

@Component({
  selector: 'app-view-service-request',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, MatDialogModule, TranslateModule],
  templateUrl: './view-service-request.component.html',
  styleUrls: ['./view-service-request.component.scss']
})
export class ViewServiceRequestComponent implements OnInit, OnDestroy {
  serviceRequest: ServiceRequest | null = null;
  isLoading = true;
  error = '';
  showPrintMenu = false;
  private subscription: Subscription | null = null;

  // Device types mapping
  deviceTypeMap: { [key: string]: string } = {
    'ثلاجة': 'REFRIGERATOR',
    'مكيف هواء': 'AIR_CONDITIONER',
    'شاشة': 'SCREEN',
    'غسالة': 'WASHING_MACHINE',
    'تلفزيون': 'TV'
  };

  // Icons
  faPrint = faPrint;
  faArrowLeft = faArrowLeft;
  faEdit = faEdit;
  faUser = faUser;
  faLaptop = faLaptop;
  faClipboardList = faClipboardList;
  faStickyNote = faStickyNote;
  faExclamation = faExclamation;
  faTools = faTools;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faExclamationTriangle = faExclamationTriangle;
  faIdCard = faIdCard;
  faTag = faTag;
  faFileAlt = faFileAlt;
  faFilePdf = faFilePdf;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: ServiceRequestsService,
    private printService: PrintService,
    private dialog: MatDialog,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadServiceRequest(+id);
    } else {
      this.error = 'VIEW.ERROR_INVALID_ID';
      this.isLoading = false;
    }
    
    // Close print menu when clicking outside
    document.addEventListener('click', this.handleOutsideClick.bind(this));
  }
  
  ngOnDestroy(): void {
    // Remove event listener on component destroy
    document.removeEventListener('click', this.handleOutsideClick.bind(this));
    
    // Unsubscribe to prevent memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  handleOutsideClick(event: MouseEvent): void {
    const printButton = document.querySelector('.btn-print');
    const printMenu = document.querySelector('.print-menu');
    
    if (this.showPrintMenu && 
        printButton && 
        printMenu && 
        !printButton.contains(event.target as Node) && 
        !printMenu.contains(event.target as Node)) {
      this.showPrintMenu = false;
    }
  }

  loadServiceRequest(id: number): void {
    this.isLoading = true;
    this.subscription = this.service.getServiceRequestById(id).subscribe({
      next: (response) => {
        this.serviceRequest = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading service request:', err);
        this.error = 'VIEW.ERROR_LOADING_REQUEST';
        this.isLoading = false;
      }
    });
  }

  editRequest(): void {
    if (this.serviceRequest?.requestId) {
      this.router.navigate(['/dashboard/service-requests', this.serviceRequest.requestId, 'edit']);
    }
  }

  togglePrintMenu(event: Event): void {
    event.stopPropagation(); // Prevent event from bubbling up
    this.showPrintMenu = !this.showPrintMenu;
  }

  getDeviceTypeTranslationKey(deviceType: string | null | undefined): string {
    if (!deviceType) return 'VIEW.NOT_SPECIFIED';
    
    // Check if the device type is one of our standard types
    const deviceTypeKey = this.deviceTypeMap[deviceType];
    
    if (deviceTypeKey) {
      return 'DEVICE_TYPES.' + deviceTypeKey;
    } else {
      // For custom device types, return the original value
      return deviceType;
    }
  }

  isKnownDeviceType(deviceType: string | null | undefined): boolean {
    if (!deviceType) return false;
    return !!this.deviceTypeMap[deviceType];
  }

  // Helper methods for getting translation keys
  getStatusTranslationKey(status: string | null): string {
    if (!status) return 'VIEW.NOT_SPECIFIED';
    
    switch (status) {
      case 'قيد الانتظار': return 'VIEW.STATUS_PENDING';
      case 'قيد التصليح': return 'VIEW.STATUS_IN_PROGRESS';
      case 'مكتمل': return 'VIEW.STATUS_COMPLETED';
      case 'ملغى': return 'VIEW.STATUS_CANCELLED';
      default: return 'VIEW.NOT_SPECIFIED';
    }
  }

  getConfirmationStatusTranslationKey(status: string | null): string {
    if (!status) return 'VIEW.NOT_SPECIFIED';
    
    switch (status) {
      case 'قيد الانتظار': return 'VIEW.STATUS_PENDING';
      case 'تم التأكيد': return 'VIEW.STATUS_CONFIRMED';
      case 'تم الرفض': return 'VIEW.STATUS_REJECTED';
      default: return 'VIEW.NOT_SPECIFIED';
    }
  }

  getSmsStatusTranslationKey(status: string | null): string {
    if (!status) return 'VIEW.UNKNOWN';
    
    switch (status) {
      case 'تم التسليم': return 'VIEW.SMS_DELIVERED';
      case 'قيد الإرسال': return 'VIEW.SMS_PENDING';
      case 'فشل': return 'VIEW.SMS_FAILED';
      default: return 'VIEW.UNKNOWN';
    }
  }

  // Format methods
  formatDate(date: string | undefined): string {
    if (!date) return this.translateService.instant('VIEW.NOT_SPECIFIED');
    
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    // Return in dd/MM/yyyy format
    return `${day}/${month}/${year}`;
  }

  formatDateTime(date: string | undefined): string {
    if (!date) return this.translateService.instant('VIEW.NOT_SPECIFIED');
    
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    // Return in dd/MM/yyyy HH:mm format
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Methods for handling multiple devices and used parts
  getAllUsedParts(): UsedPart[] {
    if (!this.serviceRequest?.devices) {
      return [];
    }
    
    let allParts: UsedPart[] = [];
    this.serviceRequest.devices.forEach(device => {
      if (device.usedParts && device.usedParts.length > 0) {
        allParts = allParts.concat(device.usedParts);
      }
    });
    
    return allParts;
  }

  getTotalPartsPrice(): number {
    const allParts = this.getAllUsedParts();
    return allParts.reduce((total, part) => total + (part.totalPrice || 0), 0);
  }

  // Updated print methods to handle multiple devices
  printCustomerCard(): void {
    if (this.serviceRequest) {
      this.openPrintPreview(
        this.translateService.instant('VIEW.CUSTOMER_CARD'), 
        this.printService.createCustomerCardHTML(this.serviceRequest),
        this.printService.getCustomerCardStyles(),
        'customer-card'
      );
    }
    this.showPrintMenu = false;
  }

  printDeviceSticker(): void {
    if (this.serviceRequest) {
      const devices = this.serviceRequest.devices || [];
      
      if (devices.length === 0) {
        alert('لا توجد أجهزة للطباعة');
        this.showPrintMenu = false;
        return;
      }
      
      // If only one device, print directly
      if (devices.length === 1) {
        this.openPrintPreview(
          this.translateService.instant('VIEW.DEVICE_STICKER'), 
          this.printService.createDeviceStickerHTML(this.serviceRequest, 0),
          this.printService.getDeviceStickerStyles(),
          'device-sticker',
          0
        );
      } else {
        // If multiple devices, open preview with device selector
        this.openPrintPreview(
          this.translateService.instant('VIEW.DEVICE_STICKER'), 
          this.printService.createDeviceStickerHTML(this.serviceRequest, 0),
          this.printService.getDeviceStickerStyles(),
          'device-sticker',
          0
        );
      }
    }
    this.showPrintMenu = false;
  }

  printRequestSummary(): void {
    if (this.serviceRequest) {
      this.openPrintPreview(
        this.translateService.instant('VIEW.REQUEST_REPORT'), 
        this.printService.createRequestSummaryHTML(this.serviceRequest),
        this.printService.getRequestSummaryStyles(),
        'request-summary'
      );
    }
    this.showPrintMenu = false;
  }

  generatePdf(): void {
    if (this.serviceRequest) {
      try {
        this.printService.generatePdf(this.serviceRequest);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert(this.translateService.instant('VIEW.ERROR_GENERATING_PDF'));
      }
    }
    this.showPrintMenu = false;
  }

  openPrintPreview(title: string, content: string, styles: string, printType?: 'customer-card' | 'device-sticker' | 'request-summary', deviceIndex?: number): void {
    const dialogData: PrintPreviewDialogData = {
      title, 
      content, 
      styles,
      serviceRequest: this.serviceRequest || undefined,
      printType,
      deviceIndex
    };

    const dialogRef = this.dialog.open(PrintPreviewDialogComponent, {
      width: '90%',
      height: '90%',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'print-preview-dialog-container',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (result.action) {
          case 'pdf':
            this.generatePdf();
            break;
          case 'print-all-devices':
            if (this.serviceRequest) {
              this.printService.printAllDeviceStickers(this.serviceRequest);
            }
            break;
          case 'device-change':
            // Reopen dialog with new device
            if (this.serviceRequest && typeof result.deviceIndex === 'number') {
              this.openPrintPreview(
                title,
                this.printService.createDeviceStickerHTML(this.serviceRequest, result.deviceIndex),
                styles,
                printType,
                result.deviceIndex
              );
            }
            break;
          case 'print':
            // Handle direct print action
            if (printType === 'customer-card' && this.serviceRequest) {
              this.printService.printCustomerCard(this.serviceRequest);
            } else if (printType === 'device-sticker' && this.serviceRequest) {
              this.printService.printDeviceSticker(this.serviceRequest, deviceIndex || 0);
            } else if (printType === 'request-summary' && this.serviceRequest) {
              this.printService.printRequestSummary(this.serviceRequest);
            }
            break;
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/service-requests']);
  }
}