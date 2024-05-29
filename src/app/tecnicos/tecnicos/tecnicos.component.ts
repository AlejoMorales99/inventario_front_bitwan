import { ActivosFijosService } from './../../services/activosFijos/activos-fijos.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.css']
})
export class TecnicosComponent implements OnInit {

  config = {
    sortKey: 'ID',  // Columna por defecto para ordenar (puedes cambiarla según tus necesidades)
    sortReverse: false,  // Orden ascendente por defecto (puedes cambiarlo según tus necesidades)
    sortOrder: '',  // Orden actual: '' (ninguno), 'asc' (ascendente), 'desc' (descendente)
  };



  constructor(private loginService:LoginService,private route: ActivatedRoute, private router: Router,  private rout: Router, private activosFijos: ActivosFijosService){}


  ocultarNombreCompletoTecnico: boolean = false;
  nombreTecnicoCompleto:any;
  validarTotalOnts:boolean = false;
  totalOnts:any;
  inventarioTecnicos:any;
  activosFijosTecnicos:any;
  filtroTecnico:string = "Seleciona al tecnico"

  selectedIndex:string = "";

  crearNuevoTecnico:string = "";

  public buscarActivos: any;
  itemsPerPage: number = 10;
  page: number = 1;

  ngOnInit() {

    //al iniciar la pagina llamo a la funcion getUser la cual me trae la informacion del usuario que se logue
    const usuario = this.loginService.getUser();

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


    }else if(usuario.data.nombres!= "KAROL YISETH" && usuario.data.nombres!="MARI LUZ" && usuario.data.nombres!="MILTON FERLEY"){
      Swal.fire({
        title: 'ERROR',
        text: 'NO TIENE PERMISOS PARA ACCEDER A ESTA RUTA',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

      this.rout.navigate(['/inicio']);

    }else{

      this.loginService.getTecnicos().subscribe((tecnicos:any)=>{
        this.inventarioTecnicos = tecnicos.sort((a:any, b:any) => a.tercerocol.localeCompare(b.tercerocol));
      })

    }


  }


  listarInventarioTecnicos(evento:any){

    const servicio = evento.idservicio;
    this.selectedIndex = evento.numeroTercero;


    this.activosFijos.getActivosFijosTecnicosInventario(this.selectedIndex).subscribe(inventarioTecnico=>{

      this.activosFijosTecnicos = inventarioTecnico;

    })

    this.validarTotalOnts = true;

    this.activosFijos.totalActivosFijosTecnicos(this.selectedIndex).subscribe((total:any)=>{
      this.totalOnts = total[0].total;
    })




  }


  cambiarOrden(columna: string) {
    if (this.config.sortKey === columna) {
      this.config.sortOrder = this.config.sortReverse ? 'asc' : 'desc';
      this.config.sortReverse = !this.config.sortReverse;
    } else {
      this.config.sortKey = columna;
      this.config.sortOrder = 'asc';
      this.config.sortReverse = false;
    }
  }


  actualizarPaginacion() {
    // Reiniciar la paginación a la primera página cuando se cambie la cantidad de registros por página
    this.page = 1;
  }


  registrarTecnicoNuevo(){

    if(this.crearNuevoTecnico == ""){
      Swal.fire({
        title: 'ERROR',
        text: `EL CAMPO NO PUEDE ESTAR VACIO`,
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });
    }else{

      this.activosFijos.registrarTecnicoNuevo(this.crearNuevoTecnico).subscribe(tecnicoNuevo=>{

        this.ngOnInit();


        Swal.fire({
          title: 'EXITO',
          text: `TECNICO CREADO CON EXITO`,
          icon: 'success',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

      })

    }





  }

  generateExcelReport() {

    Swal.fire({
      title: 'Generar Informe',
      text: '¿Estas seguro de generar un informe?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, estoy seguro',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    }).then((result) => {

      if (result.isConfirmed) {


        const datosReporte:any[] = this.activosFijosTecnicos;

        const datosReporteSinIdActivoFijo = datosReporte.map(item => {
          // Copia el objeto para evitar modificar el objeto original
          const newItem = { ...item };
          // Elimina la propiedad idactivoFijo si existe
          delete newItem.idactivoFijo;
          delete newItem.fechaingreso;
          delete newItem.fechaModificacion;
          delete newItem.servicio;
          delete newItem.marcacol;
          delete newItem.referencia_ont;
          delete newItem.referencia;
          delete newItem.usuario;
          delete newItem.usuarioModifica;
          return newItem;
        });

        // Obtén la hoja de cálculo generada
        /* const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(document.getElementById('tableOntsActivosFijos')); */

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosReporteSinIdActivoFijo);

        // Define un estilo para las columnas (ancho y espacio)
        const columnStyles = [
        // Primera columna (A), ancho 20 (en unidades por defecto, aproximadamente 8.43 caracteres)
        { width: 20 , color: 'red'},
        // Segunda columna (B), ancho 30
        { width: 15 },
        // Tercera columna (C), ancho 40
        { width: 15 },

        { width: 20 },

        { width: 20 },

        { width: 20 }
        ];

        const colInfo = { wch: 20 }; // Esto define el ancho de la columna en unidades de caracteres (20 caracteres en este caso)

        // Aplica los estilos de ancho de columna a la hoja
        columnStyles.forEach((style, columnIndex) => {
        const col = XLSX.utils.encode_col(columnIndex); // Convierte el índice a la letra de la columna
        if (!ws['!cols']) {
          ws['!cols'] = [];
        }
         ws['!cols'].push({ ...colInfo, ...style });
        });

        // Crea un libro de Excel y agrega la hoja con los estilos
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'informeInventarioTecnicos');

        // Guarda el archivo Excel
        XLSX.writeFile(wb, 'informeInventarioTecnicos.xlsx');
      }


    })

  }


  cambiarEstadoTecnico(){

    if(this.selectedIndex == ""){
      Swal.fire({
        title: 'ERROR',
        text: `Por favor selecione primero al tecnico que desea Deshabilitar`,
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });
    }else{

      Swal.fire({
        title: '¿Estás seguro de querer deshabilitar a este tecnico?',
        text: 'Una vez deshabilitado no podra deshacer el cambio!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, estoy seguro',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      }).then((result) => {
        if (result.isConfirmed) {

          this.activosFijos.cambiarEstadoTecnico(this.selectedIndex).subscribe(res=>{



            this.ngOnInit();

            Swal.fire({
              title: 'EXITO',
              text: `Tecnico deshabilitado con exito, por favor refresque la pagina`,
              icon: 'success',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });



          });





        }})

    }



  }

}
