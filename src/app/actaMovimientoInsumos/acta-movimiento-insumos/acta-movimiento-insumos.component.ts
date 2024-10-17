import { Component, OnInit } from '@angular/core';
import { ActivosFijosService } from 'src/app/services/activosFijos/activos-fijos.service';
import { InventarioInsumosService } from 'src/app/services/inventarioInsumos/inventario-insumos.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acta-movimiento-insumos',
  templateUrl: './acta-movimiento-insumos.component.html',
  styleUrls: ['./acta-movimiento-insumos.component.css']
})
export class ActaMovimientoInsumosComponent implements OnInit {

  insSelecEnviar: { idinsumo: number, nombreInsumo: string, cantidad?: number | string }[] = [];

  tecnicoEnvio: string = "";
  Descripcion:string = "";
  bodegaAlcala1:string= "";

  permiso:any = "";

  getAllActasDeMovimiento: any;
  getListaInsumos: any;
  getbodegasTecnicos: any;
  getInsumosPorIdActa: any;


  itemsPerPage: number = 10;
  page: number = 1;


  usuarioLogueado:any;

  constructor(private servicesInsumos: InventarioInsumosService, private bodegasTecnicos: ActivosFijosService,private loginServices: LoginService) { }

  ngOnInit(): void {

    this.usuarioLogueado = this.loginServices.getTecnico();
    this.permiso = localStorage.getItem('permisos');

    if(this.permiso == "administrador"){

      this.servicesInsumos.getAllActasDeMovimiento().subscribe((res: any) => {
        this.getAllActasDeMovimiento = res;

      })

    }else{

      this.servicesInsumos.getAllActasDeMovimientoTecnicos().subscribe((res: any) => {
        this.getAllActasDeMovimiento = res;

      })

    }

    this.servicesInsumos.getListInsumos().subscribe((res: any) => {
      this.getListaInsumos = res;
    })

    this.bodegasTecnicos.getBodegas("Envio a Técnico").subscribe((res: any) => {

      this.getbodegasTecnicos = res;

    })



  }




  crearActa() {
    const hasEmptyQuantity = this.insSelecEnviar.some(insumo => !insumo.cantidad || Number(insumo.cantidad) <= 0);

    if (this.insSelecEnviar.length === 0 || hasEmptyQuantity || this.tecnicoEnvio.trim() === '') {
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
        title: '¿Estás seguro?',
        text: 'Por favor Verifique que la informacion este correcta, ya que no podra modificar la informacion despues de crear el acta!',
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

          this.servicesInsumos.postActasDeMovimientosInsumos(this.insSelecEnviar, this.tecnicoEnvio , this.Descripcion).subscribe(res => {

            this.insSelecEnviar = [];
            this.tecnicoEnvio = "";
            this.Descripcion = "";
            this.ngOnInit();

            Swal.fire({
              title: 'EXITO',
              text: 'ACTA CREADA CON EXITO',
              icon: 'success',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });
          });
        }
      })
    }
  }


  verOntsDeLasActas(idActa: string) {

    this.servicesInsumos.getInsumosPorIdActa(idActa).subscribe(res => {
      this.getInsumosPorIdActa = res;
    });

  }

  separacionPorPuntosCantidad(event: any, index: number): void {
    const value = event.target.value.replace(/\D/g, ''); // Remove all non-digit characters
    this.insSelecEnviar[index].cantidad = this.formatNumber(value);
    event.target.value = this.insSelecEnviar[index].cantidad ?? '';
  }

  formatNumber(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Add dots every three digits
  }

  updateInputs() {
    // Asegurarse de que los insumos seleccionados tengan una propiedad 'cantidad'
    this.insSelecEnviar = this.insSelecEnviar.map(insumo => {
      if (!insumo.hasOwnProperty('cantidad')) {
        insumo.cantidad = 0;
      }
      return insumo;
    });
  }

}
