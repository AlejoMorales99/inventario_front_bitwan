
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from '../../../../dotenv';


@Injectable({
  providedIn: 'root'
})
export class TecnicosService {

  constructor(private http: HttpClient) { }


  urlTecnicos: String = environment.ip_serber_pruebas_https

  getTecnicos(){
    return this.http.get(`${this.urlTecnicos}`)
  }


}
