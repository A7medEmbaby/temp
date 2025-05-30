import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceRequestsService } from '../service-requests.service';
import { ServiceRequest, DeviceType, DeviceModel } from '../service-request.model';
import { Router, ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { 
  faEdit, 
  faTrash, 
  faEye, 
  faPlus, 
  faSearch, 
  faFilter, 
  faExclamationTriangle,
  faSearchMinus,
  faFileExport,
  faSyncAlt
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../shared/services/language.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-list-service-requests',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, FormsModule, TranslateModule],
  templateUrl: './list-service-requests.component.html',
  styleUrls: ['./list-service-requests.component.scss']
})
export class ListServiceRequestsComponent implements OnInit {
  serviceRequests: ServiceRequest[] = [];
  filteredRequests: ServiceRequest[] = [];
  isLoading = true;
  error = '';
  searchTerm = '';
  statusFilter = '';
  confirmationStatusFilter = '';

  // Device types and models from API
  deviceTypes: DeviceType[] = [];
  deviceModels: DeviceModel[] = [];
  
  // Fallback device types mapping for translation
  fallbackDeviceTypeMap: { [key: string]: string } = {
    'ثلاجة': 'REFRIGERATOR',
    'مكيف هواء': 'AIR_CONDITIONER',
    'شاشة': 'SCREEN',
    'غسالة': 'WASHING_MACHINE',
    'تلفزيون': 'TV'
  };

  // Icons
  faEdit = faEdit;
  faTrash = faTrash;
  faEye = faEye;
  faPlus = faPlus;
  faSearch = faSearch;
  faFilter = faFilter;
  faExclamationTriangle = faExclamationTriangle;
  faSearchMinus = faSearchMinus;
  faFileExport = faFileExport;
  faSyncAlt = faSyncAlt;

  constructor(
    private service: ServiceRequestsService,
    public router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.loadDeviceTypesAndModels();
    
    this.route.queryParams.subscribe(params => {
      if (params['status']) {
        this.statusFilter = params['status'];
        this.loadRequestsByStatus();
      } else {
        this.loadAllRequests();
      }
    });
  }

  loadDeviceTypesAndModels(): void {
    forkJoin({
      deviceTypes: this.service.getAllDeviceTypes(),
      deviceModels: this.service.getAllDeviceModels()
    }).subscribe({
      next: (response) => {
        this.deviceTypes = response.deviceTypes.data || [];
        this.deviceModels = response.deviceModels.data || [];
      },
      error: (err) => {
        console.error('Error loading device types and models:', err);
        // Continue without device types/models - will use fallback
      }
    });
  }

  loadAllRequests(): void {
    this.isLoading = true;
    this.error = '';
    
    this.service.getAllServiceRequests().subscribe({
      next: (response) => {
        this.serviceRequests = response.data || [];
        this.filteredRequests = [...this.serviceRequests];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading service requests:', err);
        this.error = this.translateService.instant('SERVICE_REQUESTS.ERROR_LOADING');
        this.isLoading = false;
      }
    });
  }

  loadRequestsByStatus(): void {
    this.isLoading = true;
    this.error = '';
    
    this.service.getServiceRequestsByStatus(this.statusFilter).subscribe({
      next: (response) => {
        this.serviceRequests = response.data || [];
        this.filteredRequests = [...this.serviceRequests];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading service requests by status:', err);
        this.error = this.translateService.instant('SERVICE_REQUESTS.ERROR_LOADING_BY_STATUS');
        this.isLoading = false;
      }
    });
  }

  filterRequests(): void {
    if (!this.searchTerm && !this.statusFilter && !this.confirmationStatusFilter) {
      this.filteredRequests = [...this.serviceRequests];
      return;
    }

    const searchTermLower = this.searchTerm.toLowerCase();

    this.filteredRequests = this.serviceRequests.filter(request => {
      const matchesSearch = !this.searchTerm || 
        (request.customer?.name?.toLowerCase().includes(searchTermLower) || 
         request.customer?.phone?.toLowerCase().includes(searchTermLower) ||
         request.requestId?.toString().includes(searchTermLower) ||
         request.status?.toLowerCase().includes(searchTermLower) ||
         request.customerConfirmationStatus?.toLowerCase().includes(searchTermLower) ||
         this.searchInDevices(request, searchTermLower));
      
      const matchesStatus = !this.statusFilter || request.status === this.statusFilter;
      
      const matchesConfirmationStatus = !this.confirmationStatusFilter || 
        request.customerConfirmationStatus === this.confirmationStatusFilter;
      
      return matchesSearch && matchesStatus && matchesConfirmationStatus;
    });
  }

  searchInDevices(request: ServiceRequest, searchTerm: string): boolean {
    if (!request.devices || request.devices.length === 0) return false;
    
    return request.devices.some(deviceRequest => 
      deviceRequest.device?.deviceType?.toLowerCase().includes(searchTerm) ||
      deviceRequest.device?.model?.toLowerCase().includes(searchTerm)
    );
  }

  viewRequest(id: number): void {
    this.router.navigate(['/dashboard/service-requests', id]);
  }

  editRequest(id: number): void {
    this.router.navigate(['/dashboard/service-requests', id, 'edit']);
  }

  addRequest(): void {
    this.router.navigate(['/dashboard/service-requests', 'new']);
  }

  deleteRequest(id: number): void {
    if (confirm(this.translateService.instant('SERVICE_REQUESTS.CONFIRM_DELETE'))) {
      this.isLoading = true;
      this.service.deleteServiceRequest(id).subscribe({
        next: () => {
          this.serviceRequests = this.serviceRequests.filter(req => req.requestId !== id);
          this.filteredRequests = this.filteredRequests.filter(req => req.requestId !== id);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error deleting service request:', err);
          alert(this.translateService.instant('SERVICE_REQUESTS.ERROR_DELETE'));
          this.isLoading = false;
        }
      });
    }
  }

  formatDate(date: string): string {
    if (!date) return this.translateService.instant('SERVICE_REQUESTS.NOT_SPECIFIED');
    
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    
    // Return in dd/MM/yyyy format
    return `${day}/${month}/${year}`;
  }

  formatPhoneNumber(phone: string | null | undefined): string {
    if (!phone) return this.translateService.instant('SERVICE_REQUESTS.NOT_AVAILABLE');
    
    // Remove +966 prefix if present
    let cleanPhone = phone;
    if (cleanPhone.startsWith('+966')) {
      cleanPhone = cleanPhone.substring(4);
    } else if (cleanPhone.startsWith('966')) {
      cleanPhone = cleanPhone.substring(3);
    }
    
    return cleanPhone;
  }

  // Get primary device info for display (first device in the list)
  getPrimaryDevice(request: ServiceRequest) {
    if (!request.devices || request.devices.length === 0) {
      return { deviceType: null, model: null };
    }
    
    const firstDevice = request.devices[0];
    return {
      deviceType: firstDevice.device?.deviceType || null,
      model: firstDevice.device?.model || null
    };
  }

  // Get device count for display
  getDeviceCount(request: ServiceRequest): number {
    return request.devices?.length || 0;
  }

  // Get total maintenance cost from all devices
  getTotalMaintenanceCost(request: ServiceRequest): number {
    if (!request.devices || request.devices.length === 0) return 0;
    
    return request.devices.reduce((total, deviceRequest) => {
      return total + (deviceRequest.maintenanceCost || 0) + (deviceRequest.inspectionCost || 0);
    }, 0);
  }

  getDeviceTypeTranslationKey(deviceType: string | null | undefined): string {
    if (!deviceType) return 'SERVICE_REQUESTS.UNKNOWN';
    
    // First check if it exists in API device types
    const apiDeviceType = this.deviceTypes.find(dt => dt.typeName === deviceType);
    if (apiDeviceType) {
      // For API device types, try to find a translation key or return the name
      const fallbackKey = this.fallbackDeviceTypeMap[deviceType];
      return fallbackKey ? 'DEVICE_TYPES.' + fallbackKey : deviceType;
    }
    
    // Check fallback mapping for backward compatibility
    const deviceTypeKey = this.fallbackDeviceTypeMap[deviceType];
    if (deviceTypeKey) {
      return 'DEVICE_TYPES.' + deviceTypeKey;
    }
    
    // For custom device types, return the original value
    return deviceType;
  }

  isKnownDeviceType(deviceType: string | null | undefined): boolean {
    if (!deviceType) return false;
    
    // Check if it exists in API device types
    const apiDeviceType = this.deviceTypes.find(dt => dt.typeName === deviceType);
    if (apiDeviceType) return true;
    
    // Check fallback mapping
    return !!this.fallbackDeviceTypeMap[deviceType];
  }

  getStatusTranslationKey(status: string | null): string {
    if (!status) return 'SERVICE_REQUESTS.NOT_SPECIFIED';
    
    switch (status) {
      case 'قيد الانتظار': return 'SERVICE_REQUESTS.STATUS_PENDING';
      case 'قيد التصليح': return 'SERVICE_REQUESTS.STATUS_IN_PROGRESS';
      case 'مكتمل': return 'SERVICE_REQUESTS.STATUS_COMPLETED';
      case 'ملغى': return 'SERVICE_REQUESTS.STATUS_CANCELLED';
      default: return 'SERVICE_REQUESTS.NOT_SPECIFIED';
    }
  }

  getConfirmationStatusTranslationKey(status: string | null): string {
    if (!status) return 'SERVICE_REQUESTS.NOT_SPECIFIED';
    
    switch (status) {
      case 'قيد الانتظار': return 'SERVICE_REQUESTS.STATUS_PENDING';
      case 'تم التأكيد': return 'SERVICE_REQUESTS.STATUS_CONFIRMED';
      case 'تم الرفض': return 'SERVICE_REQUESTS.STATUS_REJECTED';
      default: return 'SERVICE_REQUESTS.NOT_SPECIFIED';
    }
  }
}