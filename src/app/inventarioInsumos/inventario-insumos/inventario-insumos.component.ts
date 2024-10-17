import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioInsumosService } from 'src/app/services/inventarioInsumos/inventario-insumos.service';
import { LoginService } from 'src/app/services/login/login.service';
import { MarcaService } from 'src/app/services/marca/marca.service';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-inventario-insumos',
  templateUrl: './inventario-insumos.component.html',
  styleUrls: ['./inventario-insumos.component.css']
})
export class InventarioInsumosComponent {



  constructor
    (
      private servicesInsumos: InventarioInsumosService,
      private rout: Router, private loginServices: LoginService,
      private proveedorServices: ProveedorService,
      private marcaServices: MarcaService
    ) { }

  contextoOperacion: String = "Aumentar un insumo";
  contextoOperacionBoton: String = "Aumentar insumo";

  nuevoInsumo: string = "";
  aumentarInsumoOregistrarNuevo :any;
  cantidadNuevoInsumos: any = "";
  stockMinimoInsumo: any = "";
  precioInsumo:string = "";
  proveedor: string = "";
  marcaText: string = "";


  totalPrecio: number = 0;

  columnaFiltroPersonalizado:any = "mostrarTodo";


  insumosAll: any;
  historialInsumosAll:any
  prooveedorInventario: any;
  marcas: any;


  insumoTextHistorial:string = "";
  fechaInicio:any;
  fechaFin:any;

  habilitarInputNuevoInsumos: boolean = false;
  habilitarInputSelectInsumos: boolean = true;
  habilitarInputsFiltrosPersonalizados: boolean = false;
  habilitarInputsFiltrosPersonalizadosbtnBuscar:boolean = false;
  desahabilitarBuscadorDinamico:boolean = true;
  ActivarFechaInicio:boolean = false;
  activarNombreInsumo:boolean = false;
  habilitarPrecio:boolean = false;
  condicionNuevoInsumos: number = 0;

  //variable para que el registro en la tabla lo muestre desde la pagina 1
  page: number = 1;
  pageHistorial:number = 1;
  //---------------------------------------------------------------------

  //variable para hacer posible la busqyeda de los registros
  public buscarInsumo: any;
  public buscarHistorialInsumo: any;
  //------------------------------------------------------


  //variable para cambiar la cantidad de registros a mostrar
  itemsPerPage: number = 15; // Valor predeterminado
  itemPerPageHistorial: number = 15;
  //---------------------------------------------------------------//



  //variable para los shorts de la tabla
  config = {
    sortKey: 'nombreInsumo',  // Columna por defecto para ordenar (puedes cambiarla según tus necesidades)
    sortReverse: false,  // Orden ascendente por defecto (puedes cambiarlo según tus necesidades)
    sortOrder: '',  // Orden actual: '' (ninguno), 'asc' (ascendente), 'desc' (descendente)
  };

  //-----------------------------------------------------------------//

  operacionesRol: boolean = true;

  ngOnInit() {


    const usuario = this.loginServices.getUser();

    //valido que el usuario no quiere entrar a las rutas de la app de manera incorrecta sin haber iniciado sesion primero
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

    } else {

      if (usuario.data.nombres == "KAROL YISETH" || usuario.data.nombres == 'MARI LUZ'){
        this.operacionesRol = true;
      }else{
        this.operacionesRol = false;
      }


      this.servicesInsumos.getAllInsumos().subscribe(res => {

        this.insumosAll = res;

        this.aumentarInsumoOregistrarNuevo = ""


      })



    }


  }

  getAllHistorialInsumos(){

    this.servicesInsumos.getAllHistorialInsumos().subscribe(res=>{


      this.historialInsumosAll = res;


    })



  }


  //funcion para implementar el short en la tabla
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
  //------------------------------------------------//

  actualizarPaginacion() {
    // Reiniciar la paginación a la primera página cuando se cambie la cantidad de registros por página
    this.page = 1;
  }

  actualizarPaginacionHistorial() {
    // Reiniciar la paginación a la primera página cuando se cambie la cantidad de registros por página
    this.pageHistorial = 1;
  }

  aumentarInsumos(){
    //funcion que trae todos los proveedores de la empresa por medio de una api en node.js
    this.proveedorServices.getProveedor().subscribe(proveedor => {
      this.prooveedorInventario = proveedor;

    })

    this.marcaServices.getMarca().subscribe(marca => {
      this.marcas = marca
    })

  }

  postInsumos() {
    
    if (this.condicionNuevoInsumos == 0) {

      if (this.aumentarInsumoOregistrarNuevo == "" || this.cantidadNuevoInsumos == "" || this.proveedor == "" || this.marcaText == "" || this.precioInsumo == "") {


        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE TODOS LOS CAMPOS',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

      } else {

        Swal.fire({
          title: 'Aumentar Insumo',
          text: '¿Estas seguro de aumentar el insumos  ' + this.aumentarInsumoOregistrarNuevo + '?',
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


            this.servicesInsumos.postInsumosExistentes(this.aumentarInsumoOregistrarNuevo, this.cantidadNuevoInsumos, this.proveedor, this.marcaText,this.precioInsumo).subscribe((res: any) => {

              if (res.estado == 200) {


                Swal.fire({
                  title: 'EXITO',
                  text: 'Insumo aumentado con Exito',
                  icon: 'success',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });



                this.cantidadNuevoInsumos = "";
                this.ngOnInit();

              } else {
                Swal.fire({
                  title: 'ERROR',
                  text: 'Error al aumentar el Insumo',
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });

              }

            })

          }

        })



      }

    } else {

      if (this.nuevoInsumo == "" || this.cantidadNuevoInsumos == "" || this.precioInsumo == "" || this.proveedor == "" || this.marcaText == "" || this.stockMinimoInsumo == "" ) {


        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE TODOS LOS CAMPOS',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

      } else if (this.nuevoInsumo.length >= 15) {


        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR INGRESE UN INSUMO CON UNA LONGITUD MENOR O IGUAL A 15 CARACTERES',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

      } else {

        Swal.fire({
          title: 'Registrar Insumo',
          text: '¿Estas seguro de registrar el insumos  ' + this.nuevoInsumo + '?',
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

            this.servicesInsumos.postInsumoNuevo(this.nuevoInsumo, this.cantidadNuevoInsumos, this.precioInsumo, this.stockMinimoInsumo, this.proveedor, this.marcaText).subscribe((res: any) => {

              if (res.estado == 200) {

                Swal.fire({
                  title: 'EXITO',
                  text: 'Registro Insertado con Exito',
                  icon: 'success',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });

                this.ngOnInit();

              } else if (res.estado == 409) {
                Swal.fire({
                  title: 'ERROR',
                  text: 'Este insumo ya existe en el inventario',
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });

              } else {
                Swal.fire({
                  title: 'ERROR',
                  text: 'Error al insertar el insumo',
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });
              }

            })


          }


        })

      }

    }

  }


  BuscarRegistrosFiltroPersonalizado(){

    if(this.columnaFiltroPersonalizado == "fechaInicioFin"){

      if(this.fechaInicio == undefined || this.fechaFin == undefined){

        Swal.fire({
          title: 'ERROR',
          text: 'Error por favor llene todos los campos',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

      }else{

        this.servicesInsumos.getInsumosFechaInicioFechFin(this.fechaInicio,this.fechaFin,this.insumoTextHistorial).subscribe((res:any)=>{
          this.historialInsumosAll = res;
        })

      }


    }else if(this.columnaFiltroPersonalizado == "nombreInsumo"){

      if(this.nuevoInsumo == ""){
        Swal.fire({
          title: 'ERROR',
          text: 'Error por favor llene todos los campos',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });
      }else{

        this.servicesInsumos.getOneNombreInsumo(this.nuevoInsumo).subscribe((res:any)=>{

          this.historialInsumosAll = res.historialInsumosAll;
          this.totalPrecio = res.total[0].totalPrecioInsumo;
          this.habilitarPrecio = true;


        })

      }





    }else{

    }




  }

  funt_FiltroPersonalizado(event:any){
    this.nuevoInsumo = "";
    this.habilitarPrecio = false;
    if(event.target.value == "fechaInicioFin"){

      this.ActivarFechaInicio = true;
      this.habilitarInputsFiltrosPersonalizadosbtnBuscar = true;

      this.activarNombreInsumo = false;

    }else if(event.target.value == "mostrarTodo"){

      this.habilitarInputsFiltrosPersonalizadosbtnBuscar = false;
      this.ActivarFechaInicio = false;
      this.activarNombreInsumo = false;
      this.getAllHistorialInsumos();

    }else if(event.target.value == "nombreInsumo"){

      this.activarNombreInsumo = true;
      this.ActivarFechaInicio = false;
      this.habilitarInputsFiltrosPersonalizadosbtnBuscar = true;

    } else{
      this.ActivarFechaInicio = false;
    }



  }


  func_nuevoInsumo() {

    this.habilitarInputNuevoInsumos = true;
    this.habilitarInputSelectInsumos = false;
    this.condicionNuevoInsumos = 1;
    this.nuevoInsumo = ""
    this.cantidadNuevoInsumos = "";
    this.stockMinimoInsumo = "";

    this.proveedor = "";
    this.marcaText = "";

    this.contextoOperacion = "Registrar insumo";
    this.contextoOperacionBoton = "Registrar insumo";

  }

  func_viejoInsumo() {
    this.habilitarInputNuevoInsumos = false;
    this.habilitarInputSelectInsumos = true;
    this.condicionNuevoInsumos = 0;
    this.nuevoInsumo = "";
    this.cantidadNuevoInsumos = "";
    this.stockMinimoInsumo = "";

    this.proveedor = "";
    this.marcaText = "";

    this.contextoOperacion = "Aumentar un insumo";
    this.contextoOperacionBoton = "Aumentar insumo";
  }

  filtroPersonalizado(){
    this.columnaFiltroPersonalizado = "mostrarTodo";
    this.habilitarInputsFiltrosPersonalizados = true;
    this.desahabilitarBuscadorDinamico = false;

  }

  activarFiltroDinamico(){
    this.habilitarInputsFiltrosPersonalizados = false;
    this.desahabilitarBuscadorDinamico = true;
    this.ActivarFechaInicio = false;
    this.habilitarInputsFiltrosPersonalizadosbtnBuscar = false;
    this.activarNombreInsumo = false;
  }

  separacionPorPuntosCantidad(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    this.cantidadNuevoInsumos = this.formatNumber(value);
    event.target.value = this.cantidadNuevoInsumos.toString();
  }

  separacionPorPuntosPrecio(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    this.precioInsumo = this.formatNumber(value);
    event.target.value = this.precioInsumo.toString();
  }

  private formatNumber(value: string): string {
    if (!value) {
      return '0';
    }
    return parseFloat(value).toLocaleString('de-DE'); // Formats the number with dots
  }


  generateExcelReport() {

    if(this.desahabilitarBuscadorDinamico == true){

      Swal.fire({
        title: 'Generar Informe',
        text: '¿Estás seguro de generar un informe?',
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


          // Obtén la tabla y las filas
          const table = document.getElementById('myTable')!;
          const rows = table.getElementsByTagName('tr');

          // Captura los datos de la tabla
          const data = [];
          for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const cells = row.getElementsByTagName('td');
            const rowData = [];
            for (let j = 0; j < cells.length; j++) {
              rowData.push(cells[j].innerText);
            }
            if (rowData.length > 0) { // Solo añade filas que tengan datos
              data.push(rowData);
            }
          }

          console.log(data);

          // Convierte los datos capturados a una hoja de cálculo
          const ws = XLSX.utils.aoa_to_sheet(data);
          console.log(ws);

          // Ajusta las columnas de la hoja
          const columnStyles = [
            { width: 20 },
            { width: 15 },
            { width: 15 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
          ];

          const colInfo = { wch: 20 };

          columnStyles.forEach((style, columnIndex) => {
            if (!ws['!cols']) {
              ws['!cols'] = [];
            }
            ws['!cols'].push({ ...colInfo, ...style });
          });

          console.log(ws['!cols']);

          const wb = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Informe');

          console.log(wb);

          XLSX.writeFile(wb, 'InformeInventarioHistorialInsumos.xlsx');
          console.log('Archivo guardado');
        }
      });


    }else{

      Swal.fire({
        title: 'Generar Informe',
        text: '¿Estás seguro de generar un informe?',
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





          const datosReporte =  this.historialInsumosAll.map((insumo: any) => {
            return {
              // Cambia el orden de las columnas según sea necesario
              NombreInsumo: insumo.nombreInsumo,
              CantidadCompra: insumo.cantidadCompra,
              precio_compra: insumo.precioInsumo,
              Fecha_compra: insumo.fecha.substring(0,10),
              usuario: insumo.usuario,
              Marca_compra: insumo.marcacol,
              Proveedor_compra: insumo.proveedor,

            };
          });

          datosReporte.push({
            NombreInsumo: '', // O puedes poner algún texto como "Total"
            CantidadCompra: '',
            precio_compra: '', // O puedes poner algún texto como "Total"
            Fecha_compra: '',
            usuario: '',
            Marca_compra: '',
            Proveedor_compra: '',
            totalComprasInsumos: this.totalPrecio
          });

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosReporte);

          // Define un estilo para las columnas (ancho y espacio)
          const columnStyles = [
            { width: 20, color: 'red' },
            { width: 15 },
            { width: 15 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
          ];

          const colInfo = { wch: 20 };

          columnStyles.forEach((style, columnIndex) => {
            if (!ws['!cols']) {
              ws['!cols'] = [];
            }
            ws['!cols'].push({ ...colInfo, ...style });
          });

          console.log(ws['!cols']);

          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'infomeHistorialInsumos');

          console.log(wb);

          XLSX.writeFile(wb, 'infomeHistorialInsumos.xlsx');

        }
      });

    }


  }

}
