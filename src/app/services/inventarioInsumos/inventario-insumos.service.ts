import { Injectable } from '@angular/core';
import { environment } from '../../../../dotenv';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class InventarioInsumosService {

  //url de la api
  urlActivosFijos: String = environment.url_server_pruebas

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


  getInsumosFechaInicioFechFin(fechaInicio:string,fechaFin:string,insumoTextHistorial:string){


    const headers = this.loginServices.getAuthHeaders();
    return this.http.get(`${this.urlActivosFijos}/getInsumosFechaInicioFechFin/${fechaInicio}/${fechaFin}/${insumoTextHistorial || "vacio"}`  , {headers})
  }

  getOneNombreInsumo(insumoText:string){


    const headers = this.loginServices.getAuthHeaders();
    return this.http.get(`${this.urlActivosFijos}/getOneNombreInsumo/${insumoText}`  , {headers})
  }

  getInsumosPorIdActa(idActa:string){

    const headers = this.loginServices.getAuthHeaders();
    return this.http.get(`${this.urlActivosFijos}/getInsumosPorIdActa/${idActa}`  , {headers})

  }


  //endPoint para aumentar insumos ya existentes
  postInsumosExistentes(nuevoInsumos:string,cantidadNuevoInsumos:number,proveedor:string,marcaText:string, precioInsumo:string){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();


    const nuevoInsumo = {
      nuevoInsumos:nuevoInsumos,
      cantidadNuevoInsumos:cantidadNuevoInsumos,
      precioInsumo:precioInsumo,
      proveedor:proveedor,
      marcaText:marcaText,
      usuario:usuario.data.nombres
    }

    return this.http.post(`${this.urlActivosFijos}/postInsumosExistentes/` , nuevoInsumo  , {headers})
  }

  //EndPoint para registrar un nuevo insumos
  postInsumoNuevo(nuevoInsumos:string,cantidadNuevoInsumos:number, precioInsumo:string, stockMinimo:string,proveedor:string,marcaText:string){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();


    const nuevoInsumo = {
      nuevoInsumos:nuevoInsumos,
      cantidadNuevoInsumos:cantidadNuevoInsumos,
      precioInsumo:precioInsumo,
      stockMinimo:stockMinimo,
      proveedor:proveedor,
      marcaText:marcaText,
      usuario:usuario.data.nombres
    }

    return this.http.post(`${this.urlActivosFijos}/postInsumoNuevo/` , nuevoInsumo  , {headers})
  }


  //-------------------------------------endPoint de actas de movimiento insumos----------------------------------------//


  getAllActasDeMovimiento(){
    const headers = this.loginServices.getAuthHeaders();
    return this.http.get(`${this.urlActivosFijos}/getAllActasDeMovimiento` ,  {headers})
  }

  getAllActasDeMovimientoTecnicos(){
    const headers = this.loginServices.getAuthHeaders();
    const usuarioSesion = this.loginServices.getTecnico();
    const usuario = this.loginServices.getUser();
    return this.http.get(`${this.urlActivosFijos}/getAllActasDeMovimientoTecnicos/${usuario.data.numerotercero}/${usuarioSesion}` ,  {headers})
  }



  getListInsumos(){

    const headers = this.loginServices.getAuthHeaders();

    return this.http.get(`${this.urlActivosFijos}/getListInsumos` ,  {headers})


  }


  getListInsumosTecnicos(){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();

    return this.http.get(`${this.urlActivosFijos}/getListInsumosTecnicos/${usuario.data.numerotercero}` ,  {headers})


  }




  //EndPoint para registrar una acta de movimiento de insumos
  postActasDeMovimientosInsumos(insSelecEnviar:any,tecnicoEnvio:string, Descripcion:string){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();
    const usuarioSesion = this.loginServices.getTecnico();

    const nuevaActaDeMovimientoInsumo = {
      registrosActa:insSelecEnviar,
      tecnicoEnvio:tecnicoEnvio,
      Descripcion:Descripcion,
      usuarioTercero:usuario.data.numerotercero,
      usuarioNombre:usuarioSesion
    }

    return this.http.post(`${this.urlActivosFijos}/postActasDeMovimientosInsumos/` , nuevaActaDeMovimientoInsumo  , {headers})
  }


  putAceptarActaDeMovimiento(idActaInsumos:any,servicioSale:string, servicioEntra:string){

    const usuario = this.loginServices.getUser();
    const headers = this.loginServices.getAuthHeaders();
    const usuarioSesion = this.loginServices.getTecnico();

    const aceptarActaDeMovimiento = {
      idActaInsumos:idActaInsumos,
      servicioSale:servicioSale,
      servicioEntra:servicioEntra,
      usuarioTercero:usuario.data.numerotercero,
      usuarioNombre:usuarioSesion
    }

    return this.http.post(`${this.urlActivosFijos}/putAceptarActaDeMovimiento/` , aceptarActaDeMovimiento  , {headers})
  }


  putRechazarActaDeMovimiento(razonAnulacionActaInsumos:string,idActaInsumos:string){

    const headers = this.loginServices.getAuthHeaders();
    const usuarioSesion = this.loginServices.getTecnico();

    const RechazarActaDeMovimiento = {
      idActaInsumos:idActaInsumos,
      razonAnulacionActaInsumos:razonAnulacionActaInsumos,
      usuarioNombre:usuarioSesion
    }

    return this.http.post(`${this.urlActivosFijos}/putRechazarActaDeMovimiento/` , RechazarActaDeMovimiento  , {headers})
  }


}
