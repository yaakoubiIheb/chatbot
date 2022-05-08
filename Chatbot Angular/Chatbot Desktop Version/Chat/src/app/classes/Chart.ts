export class ChartData{
    data:number[] = [];
    label : string;
    constructor(){}
}

export class Chart{
  type : string;
  labels : string[] = [];
  options : any = { legend: { display: true, responsive : true,maintainAspectRatio:false}};
  colors : Array<any> = [];
  dataSets : ChartData[] = [];
}