import { useState, useRef } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  CheckCircle, 
  AlertCircle,
  Clock,
  TrendingUp,
  BarChart3,
  FileWarning,
  Shield,
  Calendar,
  Printer,
  Eye,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { format, /*subMonths, startOfMonth, endOfMonth*/ } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Compliance = () => {
  //const [selectedReport, setSelectedReport] = useState(null);
  const [timeRange, setTimeRange] = useState('last-month');
  const [reportType, setReportType] = useState('all');
  const [expandedRule, setExpandedRule] = useState(null);
  const reportRef = useRef();

  // CPCB E-Waste Management Rules 2022
  const cpcbRules = [
    {
      id: 1,
      code: 'Rule 4(1)',
      title: 'Extended Producer Responsibility (EPR)',
      description: 'Producers must ensure collection and recycling of e-waste generated from their products.',
      status: 'compliant',
      lastAudit: '2023-07-15',
      nextAudit: '2024-01-15',
      documents: ['EPR Plan 2023.pdf', 'Collection Targets Q3.pdf']
    },
    {
      id: 2,
      code: 'Rule 9(2)',
      title: 'Collection Mechanism',
      description: 'Establishment of collection centers or take-back systems for e-waste.',
      status: 'partially-compliant',
      lastAudit: '2023-08-20',
      nextAudit: '2024-02-20',
      documents: ['Collection Centers List.pdf']
    },
    {
      id: 3,
      code: 'Rule 13(4)',
      title: 'Recycling Standards',
      description: 'Use of environmentally sound technologies for recycling and recovery operations.',
      status: 'compliant',
      lastAudit: '2023-06-10',
      nextAudit: '2023-12-10',
      documents: ['Recycling Process Doc.pdf', 'Environmental Clearance.pdf']
    },
    {
      id: 4,
      code: 'Rule 16(1)',
      title: 'Record Maintenance',
      description: 'Maintenance of records for e-waste handled, recycled, and disposed.',
      status: 'non-compliant',
      lastAudit: '2023-09-05',
      nextAudit: '2024-03-05',
      documents: ['E-Waste Log Q3.pdf']
    },
    {
      id: 5,
      code: 'Rule 18(3)',
      title: 'Annual Reporting',
      description: 'Submission of annual returns to the State Pollution Control Board.',
      status: 'pending',
      lastAudit: '2023-07-30',
      nextAudit: '2024-01-30',
      documents: ['Annual Return 2022.pdf']
    }
  ];

  // Sample reports data
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'Monthly E-Waste Compliance Report - September 2023',
      type: 'monthly',
      date: '2023-09-30',
      generatedBy: 'Compliance Officer',
      status: 'generated',
      summary: {
        totalItems: 1248,
        recycled: 856,
        hazardous: 127,
        complianceRate: 92
      },
      fileUrl: '/reports/sept-2023-compliance.pdf'
    },
    {
      id: 2,
      title: 'Quarterly Audit Report - Q3 2023',
      type: 'quarterly',
      date: '2023-09-30',
      generatedBy: 'Audit Team',
      status: 'generated',
      summary: {
        totalItems: 3850,
        recycled: 2950,
        hazardous: 420,
        complianceRate: 88
      },
      fileUrl: '/reports/q3-2023-audit.pdf'
    },
    {
      id: 3,
      title: 'CPCB Compliance Status Report',
      type: 'compliance',
      date: '2023-08-15',
      generatedBy: 'Legal Department',
      status: 'pending-review',
      summary: {
        totalItems: 0,
        recycled: 0,
        hazardous: 0,
        complianceRate: 75
      },
      fileUrl: '/reports/cpcb-aug-2023.pdf'
    },
    {
      id: 4,
      title: 'Annual E-Waste Management Report 2022-2023',
      type: 'annual',
      date: '2023-03-31',
      generatedBy: 'Compliance Officer',
      status: 'approved',
      summary: {
        totalItems: 12500,
        recycled: 9850,
        hazardous: 1560,
        complianceRate: 94
      },
      fileUrl: '/reports/annual-2022-2023.pdf'
    }
  ]);

  // Compliance statistics
  const complianceStats = {
    overallRate: 87,
    monthlyTarget: 95,
    pendingActions: 3,
    completedAudits: 12,
    upcomingDeadlines: 2
  };

  const generateReport = () => {
    const newReport = {
      id: reports.length + 1,
      title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Compliance Report - ${format(new Date(), 'MMMM yyyy')}`,
      type: reportType,
      date: format(new Date(), 'yyyy-MM-dd'),
      generatedBy: 'Current User',
      status: 'generated',
      summary: {
        totalItems: Math.floor(Math.random() * 1000) + 500,
        recycled: Math.floor(Math.random() * 800) + 300,
        hazardous: Math.floor(Math.random() * 100) + 50,
        complianceRate: Math.floor(Math.random() * 20) + 75
      },
      fileUrl: '#'
    };
    
    setReports([newReport, ...reports]);
  };

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`compliance-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const getStatusInfo = (status) => {
    switch(status) {
      case 'compliant':
        return { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Compliant' };
      case 'partially-compliant':
        return { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle, label: 'Partially Compliant' };
      case 'non-compliant':
        return { color: 'bg-red-100 text-red-800', icon: AlertCircle, label: 'Non-Compliant' };
      case 'pending':
        return { color: 'bg-blue-100 text-blue-800', icon: Clock, label: 'Pending' };
      default:
        return { color: 'bg-gray-100 text-gray-800', icon: Clock, label: 'Unknown' };
    }
  };

  const getReportStatusInfo = (status) => {
    switch(status) {
      case 'generated':
        return { color: 'bg-blue-100 text-blue-800', label: 'Generated' };
      case 'pending-review':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending Review' };
      case 'approved':
        return { color: 'bg-green-100 text-green-800', label: 'Approved' };
      case 'rejected':
        return { color: 'bg-red-100 text-red-800', label: 'Rejected' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Unknown' };
    }
  };

  const filteredReports = reports.filter(report => {
    if (reportType === 'all') return true;
    return report.type === reportType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance & Reporting</h2>
          <p className="text-gray-600">Track compliance with CPCB rules and generate reports</p>
        </div>
        
        <button
          onClick={generateReport}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Generate Report
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Overall Compliance</p>
              <h3 className="text-2xl font-bold text-gray-800">{complianceStats.overallRate}%</h3>
            </div>
            <div className="w-12 h-12 !bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Target: {complianceStats.monthlyTarget}%
          </p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Completed Audits</p>
              <h3 className="text-2xl font-bold text-gray-800">{complianceStats.completedAudits}</h3>
            </div>
            <div className="w-12 h-12 !bg-green-100 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">This fiscal year</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Pending Actions</p>
              <h3 className="text-2xl font-bold text-gray-800">{complianceStats.pendingActions}</h3>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Requires attention</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Upcoming Deadlines</p>
              <h3 className="text-2xl font-bold text-gray-800">{complianceStats.upcomingDeadlines}</h3>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Next 30 days</p>
        </div>
        
        <div className="bg-white p-5 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">CPCB Rules</p>
              <h3 className="text-2xl font-bold text-gray-800">{cpcbRules.length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Being tracked</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CPCB Rules Compliance */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              CPCB E-Waste Rules Compliance
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="all">All Status</option>
                <option value="compliant">Compliant</option>
                <option value="partially-compliant">Partially Compliant</option>
                <option value="non-compliant">Non-Compliant</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {cpcbRules.map(rule => {
              const StatusIcon = getStatusInfo(rule.status).icon;
              return (
                <div key={rule.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <span className="text-sm font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {rule.code}
                        </span>
                        <div className={`ml-3 inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusInfo(rule.status).color}`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {getStatusInfo(rule.status).label}
                        </div>
                      </div>
                      
                      <h4 className="font-semibold text-gray-900 mb-1">{rule.title}</h4>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                      
                      <div className="flex items-center mt-3 text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Last audit: {format(new Date(rule.lastAudit), 'MMM dd, yyyy')}
                        <span className="mx-2">•</span>
                        Next audit: {format(new Date(rule.nextAudit), 'MMM dd, yyyy')}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors ml-2"
                    >
                      {expandedRule === rule.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {expandedRule === rule.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Related Documents</h5>
                      <div className="space-y-2">
                        {rule.documents.map((doc, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 text-gray-500 mr-2" />
                              <span className="text-sm text-gray-700">{doc}</span>
                            </div>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 flex space-x-3">
                        <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          Upload Evidence
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          View Audit History
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-600" />
              Generated Reports
            </h3>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
                <option value="compliance">Compliance</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredReports.map(report => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{report.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${getReportStatusInfo(report.status).color}`}>
                    {getReportStatusInfo(report.status).label}
                  </span>
                </div>
                
                <div className="text-xs text-gray-500 mb-3">
                  Generated on {format(new Date(report.date), 'MMM dd, yyyy')} by {report.generatedBy}
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <BarChart3 className="w-3 h-3 mr-1 text-gray-500" />
                      {report.summary.totalItems} items
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      {report.summary.complianceRate}% compliance
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors">
                      <Download className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-100 transition-colors">
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Report Generation Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-blue-600" />
          Generate Compliance Report
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly Compliance Report</option>
              <option value="quarterly">Quarterly Audit Report</option>
              <option value="annual">Annual E-Waste Report</option>
              <option value="compliance">CPCB Compliance Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Period
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="last-month">Last Month</option>
              <option value="last-quarter">Last Quarter</option>
              <option value="last-year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={generateReport}
            className="px-4 py-2 !bg-blue-600 text-white rounded-lg hover:!bg-blue-700 transition-colors flex items-center"
          >
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </button>
          
          <button
            onClick={downloadPDF}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:!bg-gray-50 transition-colors flex items-center"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </button>
        </div>
      </div>

      {/* Report Preview (hidden until generated) */}
      <div ref={reportRef} className="bg-white rounded-xl shadow-sm p-6 hidden">
        <h3 className="text-2xl font-bold text-center mb-6">Compliance Report</h3>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm text-gray-600">Report Period</p>
            <p className="font-semibold">September 1-30, 2023</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Generated On</p>
            <p className="font-semibold">{format(new Date(), 'MMMM dd, yyyy')}</p>
          </div>
        </div>
        
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Metric</th>
              <th className="text-right py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Total E-Waste Items</td>
              <td className="text-right py-2">1,248</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Items Recycled</td>
              <td className="text-right py-2">856 (68.6%)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Hazardous Items</td>
              <td className="text-right py-2">127</td>
            </tr>
            <tr>
              <td className="py-2 font-semibold">Overall Compliance Rate</td>
              <td className="text-right py-2 font-semibold">92%</td>
            </tr>
          </tbody>
        </table>
        
        <h4 className="font-semibold mb-3">CPCB Rule Compliance Status</h4>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Rule</th>
              <th className="text-left py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {cpcbRules.map(rule => (
              <tr key={rule.id} className="border-b">
                <td className="py-2">{rule.code}</td>
                <td className="py-2 capitalize">{rule.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Compliance;