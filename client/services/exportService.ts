import { toast } from "@/hooks/use-toast";

export interface ExportData {
  id: string;
  [key: string]: any;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf' | 'json';
  filename?: string;
  columns?: string[];
  includeHeaders?: boolean;
}

export class ExportService {
  // Convert data to CSV format
  static toCSV(data: ExportData[], options: ExportOptions = { format: 'csv' }): string {
    if (!data || data.length === 0) {
      // Return a CSV with just headers if no data
      const headers = options.columns ? options.columns.join(',') : 'No data available';
      return options.includeHeaders !== false ? headers + '\n' : 'No data available\n';
    }

    const columns = options.columns || Object.keys(data[0]);
    const headers = options.includeHeaders !== false ? columns.join(',') + '\n' : '';
    
    const rows = data.map(row => 
      columns.map(col => {
        const value = row[col];
        // Handle special cases for CSV
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return String(value);
      }).join(',')
    ).join('\n');

    return headers + rows;
  }

  // Convert data to JSON format
  static toJSON(data: ExportData[], options: ExportOptions = { format: 'json' }): string {
    if (options.columns) {
      const filteredData = data.map(row => {
        const filtered: any = {};
        options.columns!.forEach(col => {
          filtered[col] = row[col];
        });
        return filtered;
      });
      return JSON.stringify(filteredData, null, 2);
    }
    return JSON.stringify(data, null, 2);
  }

  // Generate Excel-compatible data
  static toExcel(data: ExportData[], options: ExportOptions = { format: 'excel' }): string {
    // For simplicity, we'll return CSV format that Excel can open
    // In a real application, you'd use a library like xlsx
    return this.toCSV(data, options);
  }

  // Generate PDF (placeholder - would need a PDF library)
  static async toPDF(data: ExportData[], options: ExportOptions = { format: 'pdf' }): Promise<Blob> {
    // This is a simplified implementation
    // In a real app, you'd use jsPDF or similar
    const csvData = this.toCSV(data, options);
    const blob = new Blob([csvData], { type: 'text/plain' });
    return blob;
  }

  // Main export function
  static async exportData(data: ExportData[], options: ExportOptions): Promise<void> {
    try {
      const filename = options.filename || `export_${new Date().toISOString().split('T')[0]}`;
      let content: string | Blob;
      let mimeType: string;
      let extension: string;

      switch (options.format) {
        case 'csv':
          content = this.toCSV(data, options);
          mimeType = 'text/csv';
          extension = 'csv';
          break;
        case 'json':
          content = this.toJSON(data, options);
          mimeType = 'application/json';
          extension = 'json';
          break;
        case 'excel':
          content = this.toExcel(data, options);
          mimeType = 'application/vnd.ms-excel';
          extension = 'csv'; // Excel can open CSV files
          break;
        case 'pdf':
          content = await this.toPDF(data, options);
          mimeType = 'application/pdf';
          extension = 'pdf';
          break;
        default:
          throw new Error(`Unsupported format: ${options.format}`);
      }

      // Create download
      const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `Data exported as ${options.format.toUpperCase()} file`,
      });
    } catch (error: any) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: error.message || "Failed to export data",
        variant: "destructive",
      });
      throw error;
    }
  }

  // Export bookings data
  static async exportBookings(bookings: any[]): Promise<void> {
    const exportData = bookings.map(booking => ({
      id: booking._id,
      customer_name: booking.user?.name || 'N/A',
      customer_email: booking.user?.email || 'N/A',
      service_name: booking.service?.name || 'N/A',
      service_type: booking.service?.type || 'N/A',
      amount: booking.totalAmount,
      status: booking.status,
      booking_date: new Date(booking.bookingDate).toLocaleDateString(),
      created_at: new Date(booking.createdAt).toLocaleDateString(),
    }));

    return this.exportData(exportData, {
      format: 'csv',
      filename: `bookings_${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
    });
  }

  // Export users data
  static async exportUsers(users: any[]): Promise<void> {
    if (!users || users.length === 0) {
      toast({
        title: "No Data",
        description: "No users data available to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.isActive ? 'Active' : 'Inactive',
      joined_date: new Date(user.createdAt).toLocaleDateString(),
      last_login: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never',
    }));

    return this.exportData(exportData, {
      format: 'csv',
      filename: `users_${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
    });
  }

  // Export services data
  static async exportServices(services: any[]): Promise<void> {
    if (!services || services.length === 0) {
      toast({
        title: "No Data",
        description: "No services data available to export.",
        variant: "destructive",
      });
      return;
    }

    const exportData = services.map(service => ({
      id: service._id,
      name: service.name,
      description: service.description,
      type: service.type,
      category: service.category,
      base_price: service.pricing?.basePrice || 0,
      currency: service.pricing?.currency || '₨',
      status: service.isActive ? 'Active' : 'Inactive',
      featured: service.isFeatured ? 'Yes' : 'No',
      rating: service.rating?.average || 0,
      review_count: service.rating?.count || 0,
      created_at: new Date(service.createdAt).toLocaleDateString(),
    }));

    return this.exportData(exportData, {
      format: 'csv',
      filename: `services_${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
    });
  }

  // Export financial report
  static async exportFinancialReport(data: {
    totalRevenue: number;
    monthlyRevenue: number;
    bookings: any[];
    dateRange?: { from: Date; to: Date };
  }): Promise<void> {
    const { totalRevenue, monthlyRevenue, bookings, dateRange } = data;
    
    const summary = [
      { metric: 'Total Revenue', value: `₨ ${totalRevenue.toLocaleString()}` },
      { metric: 'Monthly Revenue', value: `₨ ${monthlyRevenue.toLocaleString()}` },
      { metric: 'Total Bookings', value: bookings.length.toString() },
      { metric: 'Average Order Value', value: `₨ ${bookings.length > 0 ? (totalRevenue / bookings.length).toFixed(2) : '0'}` },
    ];

    if (dateRange) {
      summary.unshift(
        { metric: 'Report Period', value: `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}` }
      );
    }

    return this.exportData(summary, {
      format: 'csv',
      filename: `financial_report_${new Date().toISOString().split('T')[0]}`,
      includeHeaders: true,
    });
  }

  // Generate invoice data for a booking
  static generateInvoiceData(booking: any): any {
    return {
      invoice_number: `INV-${booking._id.slice(-8).toUpperCase()}`,
      date: new Date().toLocaleDateString(),
      customer: {
        name: booking.user?.name || 'N/A',
        email: booking.user?.email || 'N/A',
        phone: booking.user?.phone || 'N/A',
      },
      service: {
        name: booking.service?.name || 'N/A',
        type: booking.service?.type || 'N/A',
        description: booking.service?.description || 'N/A',
      },
      booking_details: {
        booking_id: booking._id,
        booking_date: new Date(booking.bookingDate).toLocaleDateString(),
        status: booking.status,
      },
      financial: {
        base_amount: booking.totalAmount || 0,
        tax_rate: 0.13, // 13% VAT
        tax_amount: (booking.totalAmount || 0) * 0.13,
        total_amount: (booking.totalAmount || 0) * 1.13,
        currency: '₨',
      },
      company: {
        name: 'Kanxa Safari',
        address: 'Lamjung, Nepal',
        phone: '+977-XXX-XXXXX',
        email: 'info@kanxasafari.com',
      }
    };
  }

  // Export invoice for a specific booking
  static async exportInvoice(booking: any): Promise<void> {
    const invoiceData = this.generateInvoiceData(booking);
    
    // Flatten the invoice data for CSV export
    const flatData = [
      { field: 'Invoice Number', value: invoiceData.invoice_number },
      { field: 'Date', value: invoiceData.date },
      { field: 'Customer Name', value: invoiceData.customer.name },
      { field: 'Customer Email', value: invoiceData.customer.email },
      { field: 'Customer Phone', value: invoiceData.customer.phone },
      { field: 'Service Name', value: invoiceData.service.name },
      { field: 'Service Type', value: invoiceData.service.type },
      { field: 'Booking Date', value: invoiceData.booking_details.booking_date },
      { field: 'Base Amount', value: `${invoiceData.financial.currency} ${invoiceData.financial.base_amount.toLocaleString()}` },
      { field: 'Tax (13%)', value: `${invoiceData.financial.currency} ${invoiceData.financial.tax_amount.toFixed(2)}` },
      { field: 'Total Amount', value: `${invoiceData.financial.currency} ${invoiceData.financial.total_amount.toFixed(2)}` },
    ];

    return this.exportData(flatData, {
      format: 'csv',
      filename: `invoice_${invoiceData.invoice_number}`,
      columns: ['field', 'value'],
      includeHeaders: true,
    });
  }

  // Batch export functionality
  static async batchExport(exports: Array<{
    data: ExportData[];
    options: ExportOptions;
  }>): Promise<void> {
    try {
      for (const exportItem of exports) {
        await this.exportData(exportItem.data, exportItem.options);
        // Small delay between exports to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      toast({
        title: "Batch Export Complete",
        description: `Successfully exported ${exports.length} files`,
      });
    } catch (error) {
      toast({
        title: "Batch Export Failed",
        description: "Some files may not have been exported",
        variant: "destructive",
      });
      throw error;
    }
  }
}

export default ExportService;
