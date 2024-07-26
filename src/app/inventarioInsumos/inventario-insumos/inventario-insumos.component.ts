import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { InventarioInsumosService } from 'src/app/services/inventarioInsumos/inventario-insumos.service';
import { LoginService } from 'src/app/services/login/login.service';
import { MarcaService } from 'src/app/services/marca/marca.service';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import Swal from 'sweetalert2';

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
  cantidadNuevoInsumos: any = "";
  stockMinimoInsumo: any = "";
  proveedor: string = "";
  marcaText: string = "";



  insumosAll: any;
  prooveedorInventario: any;
  marcas: any;


  habilitarInputNuevoInsumos: boolean = false;
  habilitarInputSelectInsumos: boolean = true;
  condicionNuevoInsumos: number = 0;

  //variable para que el registro en la tabla lo muestre desde la pagina 1
  page: number = 1;
  //---------------------------------------------------------------------

  //variable para hacer posible la busqyeda de los registros
  public buscarInsumo: any;
  //------------------------------------------------------


  //variable para cambiar la cantidad de registros a mostrar
  itemsPerPage: number = 15; // Valor predeterminado
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

      })



    }


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

      if (this.nuevoInsumo == "" || this.cantidadNuevoInsumos == "" || this.proveedor == "" || this.marcaText == "") {


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
          text: '¿Estas seguro de aumentar el insumos  ' + this.nuevoInsumo + '?',
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


            this.servicesInsumos.postInsumosExistentes(this.nuevoInsumo, this.cantidadNuevoInsumos, this.proveedor, this.marcaText).subscribe((res: any) => {

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

      if (this.nuevoInsumo == "" || this.cantidadNuevoInsumos == "" || this.proveedor == "" || this.marcaText == "" || this.stockMinimoInsumo == "" ) {


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

            this.servicesInsumos.postInsumoNuevo(this.nuevoInsumo, this.cantidadNuevoInsumos, this.stockMinimoInsumo, this.proveedor, this.marcaText).subscribe((res: any) => {

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


  onInput(event: any): void {
    const value = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    this.cantidadNuevoInsumos = this.formatNumber(value);
    event.target.value = this.cantidadNuevoInsumos.toString();
  }

  private formatNumber(value: string): string {
    if (!value) {
      return '0';
    }
    return parseFloat(value).toLocaleString('de-DE'); // Formats the number with dots
  }



}
