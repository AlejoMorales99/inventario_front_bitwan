import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from '../login/login.service';
import { environment } from 'dotenv';

@Injectable({
  providedIn: 'root'
})
export class ActasOperacionesService {

  urlActivosFijos: String = environment.ip_serber_pruebas_https

  constructor(private http: HttpClient, private loginServices: LoginService) { }



  getAllActasOperaciones(page: number, itemsPerPage: number){

    const headers = this.loginServices.getAuthHeaders();


    return this.http.get(`${this.urlActivosFijos}/getAllActasOperaciones/${page}/${itemsPerPage}`,   {headers} )

  }


  getBuscarActasDeOperaciones(page: number, itemsPerPage: number,registroBuscar:string,columnaBuscar:string){

    const headers = this.loginServices.getAuthHeaders();
    return this.http.get(`${this.urlActivosFijos}/getBuscarActasDeOperaciones/${page}/${itemsPerPage}/${registroBuscar}/${columnaBuscar}`,   {headers} )

  }

  getAllActasOperacionesTecnicos(){

    const headers = this.loginServices.getAuthHeaders();
    const tecnico = this.loginServices.getTecnico();
    return this.http.get(`${this.urlActivosFijos}/getAllActasOperacionesTecnicos/${tecnico}`,   {headers} )

  }


  postActasDeOperaciones(RazonMovimiento:string,NumServicioOperaciones:string,Descripcion:string,ImgGuia:string,){
    const headers = this.loginServices.getAuthHeaders();
    const tecnico = this.loginServices.getTecnico();

    const form = new FormData();

    form.append('RazonMovimiento', RazonMovimiento);
    form.append('NumServicioOperaciones', NumServicioOperaciones);
    form.append('Descripcion', Descripcion);
    form.append('tecnico', tecnico);
    form.append('files', ImgGuia);

    return this.http.post(`${this.urlActivosFijos}/postCrearActaOperaciones`, form , {headers} )

  }


  aceptarActaOperaciones(idActaOperacion:number){

    const headers = this.loginServices.getAuthHeaders();
    const tecnico_o_administractivo = this.loginServices.getTecnico();


    const putActaOperacionesAceptar = {

      idActaOperacion:idActaOperacion,
      tecnico_o_administractivo:tecnico_o_administractivo

    }

    return this.http.put(`${this.urlActivosFijos}/putActualizarActaOperacionesAceptar`, putActaOperacionesAceptar , {headers} )

  }

  RechazarActaOperaciones(idActaOperacion:number,razonAnulacion:string){

    const headers = this.loginServices.getAuthHeaders();
    const tecnico_o_administractivo = this.loginServices.getTecnico();


    const putActaOperacionesRechazar = {

      idActaOperacion:idActaOperacion,
      tecnico_o_administractivo:tecnico_o_administractivo,
      razonAnulacion:razonAnulacion

    }

    return this.http.put(`${this.urlActivosFijos}/putActualizarActaOperacionesRechazar`, putActaOperacionesRechazar , {headers} )

  }

}
