import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'dotenv';
import { ActasOperacionesService } from 'src/app/services/actasOperaciones/actas-operaciones.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-actas-de-operaciones',
  templateUrl: './actas-de-operaciones.component.html',
  styleUrls: ['./actas-de-operaciones.component.css']
})
export class ActasDeOperacionesComponent implements OnInit {

  constructor(private actasServicesOperaciones:ActasOperacionesService,private loginServices: LoginService,private rout: Router){}

  usuario: any;

  apiUrlImg = environment.apiUrl;

  condicionBusqueda:number = 0;

  selecColumnaActasOperaciones:string = "";
  inpBuscadorActasOperaciones:string = "";

  razonAnulacion:string = "";
  userTecnico_O_Adminiistractivo:string = "";

  disabledInputBuscar:boolean = true;

  page: number = 1;
  itemsPerPage: number = 10;


  totalGetAllActasOperaciones:number = 0;

  getAllActasMovimiento:any;


  ngOnInit(): void {

    this.usuario = this.loginServices.getUser();
    this.userTecnico_O_Adminiistractivo = this.loginServices.getTecnico();

    if (this.usuario == null) {

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

    }else{
      console.log(this.userTecnico_O_Adminiistractivo);
      if(this.userTecnico_O_Adminiistractivo == "karol yiseth mosquera alzate"  ||  this.userTecnico_O_Adminiistractivo == "mari luz pulgarin" || this.userTecnico_O_Adminiistractivo == "milton ferley renteria florez" || this.userTecnico_O_Adminiistractivo == "leydi jhoana duque salazar" || this.userTecnico_O_Adminiistractivo == "yessica alejandra garcia blandon" || this.userTecnico_O_Adminiistractivo == "luz estela lopez henao"){

          this.actasServicesOperaciones.getAllActasOperaciones(this.page,this.itemsPerPage).subscribe((res:any)=>{
          this.getAllActasMovimiento = res.data;
          this.totalGetAllActasOperaciones = res.total;

        })



      }else{

        this.actasServicesOperaciones.getAllActasOperacionesTecnicos().subscribe((res:any)=>{
          this.getAllActasMovimiento = res;
        })


      }



    }


  }


  filtroLimpiar(evento: any) {

    const selectedIndex = evento.options[evento.selectedIndex].text;

    if (selectedIndex == "Filtrar todo") {
      this.inpBuscadorActasOperaciones = "";
      this.condicionBusqueda = 0;
      this.ngOnInit();


      this.disabledInputBuscar = true;

    } else {
      this.disabledInputBuscar = false;
    }


  }

  btnBuscarRegistrosActasOperaciones(){
    this.condicionBusqueda =1;
    if(this.inpBuscadorActasOperaciones == ""){

      Swal.fire({
        title: 'ERROR',
        text: 'POR FAVOR LLENE EL CAMPO BUSCADOR',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

    }else{

      this.actasServicesOperaciones.getBuscarActasDeOperaciones(this.page,this.itemsPerPage,this.inpBuscadorActasOperaciones,this.selecColumnaActasOperaciones).subscribe((res:any)=>{


        this.getAllActasMovimiento = res.data;
        this.totalGetAllActasOperaciones = res.total[0].total


      })


    }


  }


  aceptarActaOperaciones(idActaOperacion:number){

    this.actasServicesOperaciones.aceptarActaOperaciones(idActaOperacion).subscribe((res:any)=>{

      Swal.fire({
        title: 'EXITO',
        text: 'Acta Validada Exitosamente',
        icon: 'success',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

      this.ngOnInit();

    });


  }

  rechazarActaDeOperaciones(idActaOperacion:number){

    Swal.fire({
      title: '¿Por qué quieres rechazar el acta?',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Anular',
      cancelButtonText: 'Cancelar',
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('Debes ingresar una razón para anular el acta');
        }
      },
    }).then((result) => {

      if (result.isConfirmed) {

        this.razonAnulacion = result.value!;

        this.actasServicesOperaciones.RechazarActaOperaciones(idActaOperacion,this.razonAnulacion).subscribe((res:any)=>{

          Swal.fire({
            title: 'EXITO',
            text: 'Acta Rechazada con exito',
            icon: 'success',
            customClass: {
              popup: 'bg-dark',
              title: 'text-white',
              htmlContainer: 'text-white'
            }
          });

          this.ngOnInit();


        })


      }

    });


  }



  abrirImagen(nombreImagen: string): void {
    const imagenUrl = `${this.apiUrlImg}/static/` + nombreImagen;

    // Abre una nueva ventana solo si el navegador no bloquea la apertura de ventanas emergentes
    const newWindow = window.open('', '_blank');

    if (newWindow) {
      newWindow.document.write(`<html><body><img src="${imagenUrl}" alt="${nombreImagen}" /></body></html>`);
      newWindow.document.close();
    } else {

      console.error('El navegador bloqueó la apertura de ventanas emergentes');

    }
  }


  actualizarPaginacion() {

    if(this.condicionBusqueda == 1){
      this.btnBuscarRegistrosActasOperaciones();
    }else{
      this.ngOnInit();
    }
    // Reiniciar la paginación a la primera página cuando se cambie la cantidad de registros por página

  }


}
