import { Component, OnInit } from '@angular/core';
import { ActivosFijosService } from 'src/app/services/activosFijos/activos-fijos.service';
import { InventarioInsumosService } from 'src/app/services/inventarioInsumos/inventario-insumos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-acta-movimiento-insumos',
  templateUrl: './acta-movimiento-insumos.component.html',
  styleUrls: ['./acta-movimiento-insumos.component.css']
})
export class ActaMovimientoInsumosComponent implements OnInit {

  insSelecEnviar: { idinsumo: number, nombreInsumo: string, cantidad?: number | string }[] = [];

  tecnicoEnvio:string = "";


  getAllActasDeMovimiento:any;
  getListaInsumos:any;
  getbodegasTecnicos:any;
  itemsPerPage: number = 10;
  page: number = 1;

  constructor(private servicesInsumos:InventarioInsumosService, private bodegasTecnicos:ActivosFijosService){}

  ngOnInit(): void {


    this.servicesInsumos.getAllActasDeMovimiento().subscribe((res:any)=>{
      this.getAllActasDeMovimiento = res;
    })

    this.servicesInsumos.getListInsumos().subscribe((res:any)=>{
      this.getListaInsumos = res;
    })

    this.bodegasTecnicos.getBodegas("Envio a Técnico").subscribe((res:any)=>{

      this.getbodegasTecnicos = res;
      console.log( this.getbodegasTecnicos);
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
      // Código para crear el acta

      this.servicesInsumos.postActasDeMovimientosInsumos(this.insSelecEnviar,this.tecnicoEnvio).subscribe(res=>{

      });

    }
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
