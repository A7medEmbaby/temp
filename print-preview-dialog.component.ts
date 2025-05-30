// src/app/components/dashboard/service-requests/print-preview-dialog.component.ts
import { Component, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTimes, faPrint, faFilePdf, faCog } from '@fortawesome/free-solid-svg-icons';
import { ServiceRequest } from '../service-request.model';

export interface PrintPreviewDialogData {
  title: string;
  content: string;
  styles: string;
  serviceRequest?: ServiceRequest;
  printType?: 'customer-card' | 'device-sticker' | 'request-summary';
  deviceIndex?: number;
}

@Component({
  selector: 'app-print-preview-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    FontAwesomeModule
  ],
  template: `
    <div class="print-preview-dialog">
      <div class="dialog-header">
        <h2>{{ data.title }}</h2>
        <div class="header-controls">
          <!-- Device selector for device stickers -->
          <div class="device-selector" *ngIf="data.printType === 'device-sticker' && hasMultipleDevices()">
            <mat-form-field appearance="outline" class="device-select-field">
              <mat-label>اختر الجهاز</mat-label>
              <mat-select [(value)]="selectedDeviceIndex" (selectionChange)="onDeviceChange()">
                <mat-option *ngFor="let device of getDevices(); let i = index" [value]="i">
                  الجهاز {{ i + 1 }}: {{ device.device?.deviceType || 'غير معروف' }} - {{ device.device?.model || 'غير معروف' }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <div class="actions">
            <!-- Print all devices option for device stickers -->
            <button 
              *ngIf="data.printType === 'device-sticker' && hasMultipleDevices()"
              class="btn btn-print-all" 
              (click)="printAllDevices()"
              title="طباعة جميع الأجهزة">
              <fa-icon [icon]="faCog"></fa-icon> طباعة الكل
            </button>
            
            <button class="btn btn-pdf" (click)="generatePdf()">
              <fa-icon [icon]="faFilePdf"></fa-icon> حفظ كملف PDF
            </button>
            <button class="btn btn-print" (click)="print()">
              <fa-icon [icon]="faPrint"></fa-icon> طباعة
            </button>
            <button class="btn btn-close" (click)="close()">
              <fa-icon [icon]="faTimes"></fa-icon>
            </button>
          </div>
        </div>
      </div>
      <div class="preview-container">
        <div class="preview-info" *ngIf="data.printType === 'device-sticker' && hasMultipleDevices()">
          <p>عرض الجهاز {{ selectedDeviceIndex + 1 }} من {{ getDevices().length }}</p>
        </div>
        <iframe #previewFrame class="preview-frame"></iframe>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    
    .print-preview-dialog {
      display: flex;
      flex-direction: column;
      height: 100%;
      direction: rtl;
      font-family: 'Tajawal', sans-serif;
    }
    
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #1f2937;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    
    .device-selector {
      min-width: 200px;
    }
    
    .device-select-field {
      margin-bottom: 0 !important;
    }
    
    .device-select-field ::ng-deep .mat-mdc-form-field-subscript-wrapper {
      display: none;
    }
    
    .device-select-field ::ng-deep .mdc-text-field {
      height: 40px;
    }
    
    .device-select-field ::ng-deep .mat-mdc-form-field-infix {
      min-height: 40px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
    
    .actions {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      white-space: nowrap;
    }
    
    .btn-print {
      background-color: #eff6ff;
      color: #1e40af;
    }
    
    .btn-print:hover {
      background-color: #dbeafe;
    }
    
    .btn-print-all {
      background-color: #f0f9ff;
      color: #0369a1;
    }
    
    .btn-print-all:hover {
      background-color: #e0f2fe;
    }
    
    .btn-pdf {
      background-color: #fff7ed;
      color: #c2410c;
    }
    
    .btn-pdf:hover {
      background-color: #ffedd5;
    }
    
    .btn-close {
      background-color: #f3f4f6;
      color: #4b5563;
    }
    
    .btn-close:hover {
      background-color: #e5e7eb;
    }
    
    .preview-container {
      flex: 1;
      padding: 1rem;
      background-color: #f3f4f6;
      overflow: auto;
      display: flex;
      flex-direction: column;
    }
    
    .preview-info {
      background: white;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
      text-align: center;
      font-size: 0.875rem;
      color: #4b5563;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .preview-frame {
      width: 100%;
      flex: 1;
      border: none;
      background-color: white;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      border-radius: 0.375rem;
    }
    
    @media (max-width: 768px) {
      .dialog-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .header-controls {
        justify-content: space-between;
      }
      
      .device-selector {
        min-width: auto;
        flex: 1;
      }
      
      .actions {
        justify-content: flex-end;
      }
      
      .btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.8rem;
      }
    }
  `]
})
export class PrintPreviewDialogComponent implements AfterViewInit {
  // Icons
  faTimes = faTimes;
  faPrint = faPrint;
  faFilePdf = faFilePdf;
  faCog = faCog;
  
  @ViewChild('previewFrame') previewFrame!: ElementRef<HTMLIFrameElement>;
  
  selectedDeviceIndex: number = 0;

  constructor(
    public dialogRef: MatDialogRef<PrintPreviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PrintPreviewDialogData
  ) {
    this.selectedDeviceIndex = data.deviceIndex || 0;
  }

  ngAfterViewInit() {
    this.loadPreview();
  }

  hasMultipleDevices(): boolean {
    return !!(this.data.serviceRequest?.devices && this.data.serviceRequest.devices.length > 1);
  }

  getDevices() {
    return this.data.serviceRequest?.devices || [];
  }

  onDeviceChange() {
    if (this.data.printType === 'device-sticker') {
      // Reload preview with new device
      this.dialogRef.close({ 
        action: 'device-change', 
        deviceIndex: this.selectedDeviceIndex 
      });
    }
  }

  printAllDevices() {
    if (this.data.printType === 'device-sticker') {
      this.dialogRef.close({ action: 'print-all-devices' });
    }
  }

  loadPreview() {
    if (this.previewFrame && this.previewFrame.nativeElement) {
      const frameDoc = this.previewFrame.nativeElement.contentDocument || 
                      this.previewFrame.nativeElement.contentWindow?.document;
      
      if (frameDoc) {
        // Determine appropriate print settings based on dialog title
        let printSettings = '';
        
        if (this.data.title.includes('بطاقة العميل')) {
          // Customer card settings - A5 Portrait
          printSettings = `
            @page {
              size: A5 portrait;
              margin: 10mm;
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
              @page { margin: 10mm; }
              body { margin: 0; }
            }
          `;
        } else if (this.data.title.includes('ملصق الجهاز')) {
          // Device sticker settings - A6 Portrait
          printSettings = `
            @page {
              size: A6 portrait;
              margin: 5mm;
            }
            @media print {
              html, body {
                width: 105mm;
                height: 148mm;
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
              @page { margin: 5mm; }
              body { margin: 0; }
            }
          `;
        } else if (this.data.title.includes('تقرير')) {
          // Full report settings - A5 Portrait
          printSettings = `
            @page {
              size: A5 portrait;
              margin: 10mm;
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
              .parts-section, .sms-section {
                page-break-before: always;
              }
              @page { margin: 10mm; }
            }
          `;
        }
        
        frameDoc.open();
        frameDoc.write(`
          <!DOCTYPE html>
          <html dir="rtl" lang="ar">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${this.data.title}</title>
            <style>
              ${this.data.styles}
              ${printSettings}
            </style>
          </head>
          <body>
            ${this.data.content}
          </body>
          </html>
        `);
        frameDoc.close();
      }
    }
  }

  print() {
    if (this.previewFrame && this.previewFrame.nativeElement && this.previewFrame.nativeElement.contentWindow) {
      try {
        // Add a print listener to detect when printing is done
        const contentWindow = this.previewFrame.nativeElement.contentWindow;
        const mediaQueryList = contentWindow.matchMedia('print');
        
        const printListener = (mql: MediaQueryListEvent) => {
          if (!mql.matches) {
            // Print dialog was closed
            mediaQueryList.removeEventListener('change', printListener);
          }
        };
        
        mediaQueryList.addEventListener('change', printListener);
        
        // Focus and print
        contentWindow.focus();
        contentWindow.print();
      } catch (error) {
        console.error('Error printing from preview:', error);
        // Fallback: close dialog and let parent handle printing
        this.dialogRef.close({ action: 'print' });
      }
    }
  }

  generatePdf() {
    // This would trigger the PDF generation in the parent component
    this.dialogRef.close({ action: 'pdf' });
  }

  close() {
    this.dialogRef.close();
  }
}