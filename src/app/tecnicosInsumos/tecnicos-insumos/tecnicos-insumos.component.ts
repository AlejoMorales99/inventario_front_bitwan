import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioInsumosService } from 'src/app/services/inventarioInsumos/inventario-insumos.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tecnicos-insumos',
  templateUrl: './tecnicos-insumos.component.html',
  styleUrls: ['./tecnicos-insumos.component.css']
})
export class TecnicosInsumosComponent implements OnInit {
  insumosTecnico: any;

constructor(private loginService:LoginService,private rout: Router,private servicesInsumos: InventarioInsumosService){}


itemsPerPage: number = 10;
page: number = 1;

  permiso:any;
  inventarioTecnicos:any;
  selectedIndex:string = "";


  ngOnInit(): void {
    const usuario = this.loginService.getUser();

    this.permiso = localStorage.getItem('permisos');

    if (usuario == null) {

      //mensaje de error por si no loguea
      Swal.fire({
        title: 'ERROR',
        text: 'POR FAVOR INICIE SESION PRIMERO',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

      this.rout.navigate(['']);


    }else if(this.permiso == "administrador"){

      this.loginService.getTecnicos().subscribe((tecnicos:any)=>{
        this.inventarioTecnicos = tecnicos.sort((a:any, b:any) => a.tercerocol.localeCompare(b.tercerocol));
      })




    }


  }


  listarInventarioTecnicos(evento:any){

    const servicio = evento.idservicio;


   this.servicesInsumos.getInsumosPorTecnico(servicio).subscribe(res=>{

    this.insumosTecnico = res;


   })



  }


  actualizarPaginacion() {
    // Reiniciar la paginación a la primera página cuando se cambie la cantidad de registros por página
    this.page = 1;
  }


}
