import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import * as Chart from 'chart.js';
import { ExportService } from '../services/export.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public result: { data: any, responseType: string },
  private exportService : ExportService) { }
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = [];
  value = '';
  isArray: boolean = false;
  keys: string[] = [];
  info: any[] = [];
  imageLink : any;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;
  @ViewChild('chart') chart: ElementRef;
  @ViewChild('matrice') matrice: ElementRef;

  getRandomColor() {
    let color = '#';
    let letters = '0123456789ABCDEF';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportImage(){
    let image = new Chart(this.chart.nativeElement.getContext('2d'),this.result.data);
    this.imageLink = image.toBase64Image();
    console.log(this.imageLink);
  }
  exportExcel(){
    this.exportService.exportExcel(this.result.data,"matrice");
  }

  exportPdf(){
    this.exportService.exportPdf(this.result.data);
  }
  prepareData() {
    if (this.result.responseType == "matrice") {
      if (Array.isArray(this.result.data)) {
        this.isArray = true;
        this.dataSource = new MatTableDataSource(this.result.data);
        for (let key in this.result.data[0]) {
          this.keys.push(key);
          this.displayedColumns.push(key);
        }
        setTimeout(() => this.dataSource.paginator = this.paginator);
        setTimeout(() => this.dataSource.sort = this.sort);
      } else {
        for (let key in this.result.data) {
          this.keys.push(key);
          this.info.push(this.result.data[key]);
        }
      }
    }
  }
  ngOnInit(): void {
    this.prepareData();
     
  }

}
