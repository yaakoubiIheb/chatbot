import { ElementRef, Injectable } from '@angular/core';
import * as Chart from 'chart.js';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
@Injectable({
  providedIn: 'root'
})
export class ExportService {
  excelFileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  excelFileExtension = '.xlsx';
  pdfFileType = "application/pdf;charset=utf-8";
  pdfFileExtension = ".pdf";

  exportImage(chart: ElementRef, data: any) {
    let image = new Chart(chart.nativeElement.getContext('2d'), data);
    return image.toBase64Image();
  }
  public exportPdf(data:any){
    var doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('', 11, 8);
    doc.setFontSize(11);
    doc.setTextColor(100);

    let head = [Object.keys(data[0])];
    let rows = [];
    for(let d of data){
      let row:string[] = [];
      for(let e in d){row.push(d[e])};
      rows.push(row);
    }
    (doc as any).autoTable({
      head: head,
      body: rows,
      theme: 'plain',
  });
  doc.save("matrice")
}
  /*public exportPdf(matrice:ElementRef) {
    html2canvas(matrice.nativeElement).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/png')  
      //let pdf = new jsPDF('l', 'cm', 'a4'); //Generates PDF in landscape mode
      let pdf = new jsPDF('p', 'mm', 'a4'); //Generates PDF in portrait mode
      let width = pdf.internal.pageSize.getWidth();
      let height = pdf.internal.pageSize.getHeight();
      pdf.addImage(contentDataURL, 'PNG', 0, 0, width/2, height/2);  
      pdf.save('matrice.pdf');   
    }); 
  }*/

  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
    const wb: XLSX.WorkBook = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.excelFileType });
    FileSaver.saveAs(data, fileName + this.excelFileExtension);
  }
  constructor() { }
}
