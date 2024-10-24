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
  tipoEnvioInsumosText:string = "";
  tipoEnvioInsumosTecnicos:boolean = false;
  tipoEnvioInsumosAdministractivo:boolean = false;
  tecnicoEnviarInsumos:boolean = false;

  permiso:any = "";
  razonAnulacionActaInsumos:any = "";
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

    if(this.usuarioLogueado == "karol yiseth mosquera alzate"){
      this.usuarioLogueado = "alcala1";
    }

    this.permiso = localStorage.getItem('permisos');

    if(this.permiso == "administrador"){

      this.tipoEnvioInsumosAdministractivo = true;
      this.tecnicoEnviarInsumos = true;

      this.servicesInsumos.getAllActasDeMovimiento().subscribe((res: any) => {
        this.getAllActasDeMovimiento = res;

      })

      this.servicesInsumos.getListInsumos().subscribe((res: any) => {
        this.getListaInsumos = res;
        console.log(this.getListaInsumos)
      })

    }else{
      this.tipoEnvioInsumosTecnicos = true;

      this.servicesInsumos.getAllActasDeMovimientoTecnicos().subscribe((res: any) => {
        this.getAllActasDeMovimiento = res;

      })

      this.servicesInsumos.getListInsumosTecnicos().subscribe((res: any) => {
        this.getListaInsumos = res;

        console.log(this.getListaInsumos)

      })

    }



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

          this.servicesInsumos.postActasDeMovimientosInsumos(this.insSelecEnviar, this.tecnicoEnvio , this.Descripcion).subscribe((res:any) => {

            console.log(res);

            if(res.estado == 400) {

              const insumosInsuficientesText = res.insumosInsuficientes.length > 1
                ? 'Los insumos ' + res.insumosInsuficientes.join(', ')
                : 'El insumo ' + res.insumosInsuficientes[0];

              Swal.fire({
                title: 'ERROR',
                text: insumosInsuficientesText + ' no tiene(n) la cantidad suficiente disponible, por favor intentelo de nuevo.',
                icon: 'error',
                customClass: {
                  popup: 'bg-dark',
                  title: 'text-white',
                  htmlContainer: 'text-white'
                }
              });
            } else {
              // Acción en caso de éxito
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
            }


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


  aceptarActaInsumos(idActaInsumos: string, servicioSale: string, servicioEntra: string) {

    Swal.fire({
      title: '¿Estás seguro de aceptar el acta?',
      text: 'Por favor verifique bien la informacin antes de aceptar el acta',
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

        this.servicesInsumos.putAceptarActaDeMovimiento(idActaInsumos, servicioSale, servicioEntra).subscribe((res: any) => {

          if (res.estado == 200) {
            this.ngOnInit();
            Swal.fire({
              title: 'EXITO',
              text: 'ACTA ACEPTADA CON EXITO',
              icon: 'success',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });
          } else {
            Swal.fire({
              title: 'ERROR',
              text: 'La acta no se pudo validar con exito',
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });
          }




        });


      }
    })




  }


  anularActaInsumos(idActaInsumos:string){

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
        this.razonAnulacionActaInsumos = result.value;

        this.servicesInsumos.putRechazarActaDeMovimiento(this.razonAnulacionActaInsumos,idActaInsumos).subscribe(res=>{

          this.ngOnInit();
          Swal.fire({
            title: 'EXITO',
            text: 'ACTA RECHAZADA CON EXITO',
            icon: 'success',
            customClass: {
              popup: 'bg-dark',
              title: 'text-white',
              htmlContainer: 'text-white'
            }
          });


        })


      }
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



  tipoEnvioInsumo(evento:any){

    if(evento.value == '1'){
      this.tipoEnvioInsumosAdministractivo = true;
      this.tecnicoEnviarInsumos = true;
    }else{

      this.tipoEnvioInsumosAdministractivo = true;
      this.tecnicoEnviarInsumos = false;
      this.tecnicoEnvio = "2"
    }


  }

}
