import { Injectable } from '@angular/core';
import { environment } from '../../../../dotenv';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioInsumosService {

  //url de la api
  urlActivosFijos: String = environment.apiUrl

  constructor(private http: HttpClient,  private loginServices: LoginService) { }

  //endPoint para obtener todos los insumos dependiendo del usuario que loguee
  getAllInsumos(){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();


    return this.http.get(`${this.urlActivosFijos}/getAllInsumos/${usuario.data.numerotercero}` , {headers})
  }


  getAllHistorialInsumos(){

    const headers = this.loginServices.getAuthHeaders();


    return this.http.get(`${this.urlActivosFijos}/getAllHistorialInsumos` , {headers})
  }


  //endPoint para aumentar insumos ya existentes
  postInsumosExistentes(nuevoInsumos:string,cantidadNuevoInsumos:number,proveedor:string,marcaText:string){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();


    const nuevoInsumo = {
      nuevoInsumos:nuevoInsumos,
      cantidadNuevoInsumos:cantidadNuevoInsumos,
      proveedor:proveedor,
      marcaText:marcaText,
      usuario:usuario.data.nombres
    }

    return this.http.post(`${this.urlActivosFijos}/postInsumosExistentes/` , nuevoInsumo  , {headers})
  }

  //EndPoint para registrar un nuevo insumos
  postInsumoNuevo(nuevoInsumos:string,cantidadNuevoInsumos:number,stockMinimo:string,proveedor:string,marcaText:string){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();


    const nuevoInsumo = {
      nuevoInsumos:nuevoInsumos,
      cantidadNuevoInsumos:cantidadNuevoInsumos,
      stockMinimo:stockMinimo,
      proveedor:proveedor,
      marcaText:marcaText,
      usuario:usuario.data.nombres
    }

    return this.http.post(`${this.urlActivosFijos}/postInsumoNuevo/` , nuevoInsumo  , {headers})
  }

}
