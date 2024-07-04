import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivosFijosService } from 'src/app/services/activosFijos/activos-fijos.service';
import { LoginService } from 'src/app/services/login/login.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { environment } from '../../../../dotenv';


@Component({
  selector: 'app-acta-movimiento',
  templateUrl: './acta-movimiento.component.html',
  styleUrls: ['./acta-movimiento.component.css']
})
export class ActaMovimientoComponent implements OnInit {

  apiUrlImg = environment.ip_serber_pruebas_https;

  //en esta variblae tipo Element guardo el id de la ont que se busque en el input del formulario
  @ViewChild('valorOnts') miInput!: ElementRef;

  constructor(private activosFijos: ActivosFijosService, private loginServices: LoginService, private rout: Router) { }

  //variable la cual uso para guardar la informacion del usuario que se loguea como el nombre el id etc
  usuario: any;

  userTecnico:any;

  //varibale para validar a que usuarios mostrarles el boton de poder descargar reportes
  mostrarBotonDescargaExcel:boolean = true;

  //variables las cuales guardan los valores cuando se vaya a crear un acta de movimientoo
  RazonMovimiento: string = "";
  TipoEntrega: string = "";
  BodegaEntra: string = "";
  BodegaSale: string = "";
  Descripcion: string = "";
  GuiaTrasportadora: string = "";
  ImgGuia: string = "";
  savedImage: string | null = null;
  valorNombreBodega: string = ""
  razonAnulacion: any = "";
  ServicioDelClienteEspecifico:any = "";
  archivoCapturado: any;
  combinedData:any;
  clickedActivos: number[] = [];
  botonesPresionados: { [id: string]: boolean } = {};
  idActaActualBotonVer: string | null = null;
  //----------------------------------------------------------------------------------//

  //variable que sirve para especificar por que columna va a buscar registros el usuario
  selectedColumn:string = "mostrarTodo"

  /*esta varibale la uso para tener una condicion sobre la cantidad de inputs que se pueden crear dependiendo de el tipo de movimiento que vaya a hacer el usuario o tambien para
  ocultar o mostrar el boton*/
  anular: boolean = false;



  /*todas estas variables se usan sin mas que bloquear label o inputs mostrarlos o no mostrarlos dependiendo del tipo de acta que se este creando principalmente
  en los inputs de instalacion o retiro*/
  condicionRetiro: boolean = false;
  ocultarBotonBuscarCliente: boolean = false;
  ocultarBotonBorrarCliente: boolean = false;
  mostrarInfoClienteRetirar: boolean = false;
  condicionBodegaSale: boolean = false;
  desahibilitarBuscarCliente: boolean = false;
  condicionEntraBodega: boolean = false;
  condicionOcultarBodegaEntra: boolean = false;
  condicionVariosServiciosCliente:boolean = false;
  bloquearColumnas:boolean = true;
  ocultarBotonCrearActa:boolean = true;
  ocultarNombreCompletoTecnico:boolean = false;
  dashabilitarBuscador:boolean = true;
  ocultarBotonBuscarClienteInstalacion:boolean = false;
  mostrarInfoClienteInstalar:boolean = false;
  ocultarBotonBorrarClienteInstalacion:boolean = false;

  //---------------------------------------------------------------------------------------//


  //variable para que el registro en la tabla lo muestre desde la pagina 1
  page: number = 1;
  //---------------------------------------------------------------------


  //variables en las cuales se guarda la informacion que viene del backend y despues se recorren para mostrarlas en la tabla
  guardarActivosFijos: any;
  guardarTiposDeMovimientos: any;
  guardarTipoDeEntrega: any;
  guardarServicio: any;
  guardarActa: any;
  guardarClienteRetirar: any;
  guardarServiciosClientesEspecificos:any;
  guardarAllMovimientos: any;
  nombreTecnicoCompleto:any;
  public buscarActivos: any;
  public buscarActivosActaVer: any;
  //------------------------------------------------------


  //variable para los shorts de la tabla
  config = {
    sortKey: 'idActa',  // Columna por defecto para ordenar (puedes cambiarla según tus necesidades)
    sortReverse: false,  // Orden ascendente por defecto (puedes cambiarlo según tus necesidades)
    sortOrder: '',  // Orden actual: '' (ninguno), 'asc' (ascendente), 'desc' (descendente)
  };
  //-----------------------------------------------------------------//


  //variable para cambiar la cantidad de registros a mostrar
  itemsPerPage: number = 10; // Valor predeterminado
  //---------------------------------------------------------------//

  //variables donde guardo los valores de la busqueda de una ont cuando se vaya a crear el acta al igual que la cantidad de inputs cuando se crean o se eliminan con el boton
  dynamicInputs: any[] = []; // para repetir inputs
  guardarValorOnts: any[] = [];
  resultadosPorInput: any[] = [];
  formData: any;
  //----------------------------------------------------------------------------------------//

  //estas variables las uso para validar si mostrar ciertos botones o no dependiendo del usuario
  operacionesRol: boolean = true;
  operacionInputsValidar: boolean = false;
  operacionInputsTipo: boolean = false;
  //--------------------------------------------------------------------//

  guardarServicioTecnicos: any;

  infoTextoActivosFijos:boolean = false;

  //funcion que se ejecuta apenas se carga la pagina
  ngOnInit() {

    //al iniciar la pagina llamo a la funcion getUser la cual me trae la informacion del usuario que se logue
    this.usuario = this.loginServices.getUser();
    this.userTecnico = this.loginServices.getTecnico();

    this.infoTextoActivosFijos = false;
    //si al iniciar la pagina esta variable es nula significa que el usuario esta intentando accerder a una pagina sin loguearse primero por lo cual no podra y sere redireccionado al login
    if (this.usuario == null) {

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

      this.guardarTiposDeMovimientos = [];

      //se valida que usuario es el que se esta logueando si no es ninguna de estos 2 por logica entonces se sabria que el que se loguea es un tecnico
      if (this.userTecnico == "karol yiseth mosquera alzate"  ||  this.userTecnico == "mari luz pulgarin" || this.userTecnico == "milton ferley renteria florez") {

        this.usuario.data.nombres = "alcala1"


        //funcion que obtiene todas las actas de movimiento existentes
        this.activosFijos.getAllMovimientos().subscribe(movimientos => {
          this.guardarAllMovimientos = movimientos;

          this.guardarAllMovimientos.forEach((element: any) => {
            if (element.tercerocolEntrada === null) {
              element.tercerocolEntrada = element.entraCliente;
            }
          });

          this.guardarAllMovimientos.forEach((element: any) => {
            if (element.tercerocolSalida === null) {
              element.tercerocolSalida = element.saleCliente;
            }
          });

        });

        //funcion que obtiene todas las razones de movimiento
        this.activosFijos.getRazonDeMovimiento().subscribe(razonMovimiento => {
          this.guardarTiposDeMovimientos = razonMovimiento;
        })

        //funcion que obtiene las bodegas
        this.activosFijos.getBodegasTecnicos().subscribe(Bodegass => {
          this.guardarServicioTecnicos = Bodegass;

        })


      } else {
       this.mostrarBotonDescargaExcel = false;
       this.bloquearColumnas = false;

       //funcion que muestra las actas de movimiento que tengan relacion con el tecnico que esta logueado en la aplicacion
        this.activosFijos.getAllMovimientosTecnicos().subscribe(movimientos => {
          this.guardarAllMovimientos = movimientos;

          this.guardarAllMovimientos.forEach((element: any) => {
            if (element.tercerocolEntrada === null) {
              element.tercerocolEntrada = element.entraCliente;
            }
          });

          this.guardarAllMovimientos.forEach((element: any) => {
            if (element.tercerocolSalida === null) {
              element.tercerocolSalida = element.saleCliente;
            }
          });

        });

        //funcion que obtiene las razones de movimiento pero con la condicion de que solo muestra las que los tecnicos deben de poder ver, no todas las razones las podran ver
        this.activosFijos.getRazonDeMovimientoTecnicos().subscribe(razonMovimiento => {
          this.guardarTiposDeMovimientos = razonMovimiento;
        })

        //funcion que obtiene las bodegas con la condicion de que solo podran ver algunas bodegas no todas
        this.activosFijos.getBodegasTecnicos().subscribe(Bodegas => {
          this.guardarServicioTecnicos = Bodegas;
        })

        /* this.activosFijos.getBodegas().subscribe(Bodegas => {
          this.guardarServicio = Bodegas;

        }) */

      }

      //funcion que obtiene todos los tipos de entrega que hay
      this.activosFijos.getTipoDeEntrega().subscribe(tipoEntrega => {
        this.guardarTipoDeEntrega = tipoEntrega;

      })

    }

  }

  //funcion que se encarga de las busquedad de los registros dependiendo de la columna por la cual se quiera buscar
  buscarRegistro(){

    if(this.buscarActivos!= "" && this.selectedColumn== "mostrarTodo" ){

      Swal.fire({
        title: 'ERROR',
        text: 'EL CAMPO DE BUSQUEDA DEBE DE ESTAR VACIO',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

    }else if(this.buscarActivos == "" || this.selectedColumn == ""){
      Swal.fire({
        title: 'ERROR',
        text: 'EXISTEN CAMPOS REQUERIDOS VACIOS',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });
    }else{

      if(this.selectedColumn == "fecha creacion" || this.selectedColumn =="fecha aceptacion"){

        const fechaValida = /^\d{4}-\d{2}-\d{2}$/.test(this.buscarActivos);

        if (!fechaValida) {
          Swal.fire({
            title: 'ERROR',
            text: 'El formato de la fecha es incorrecto. Debe ser YYYY-MM-DD',
            icon: 'error',
            customClass: {
              popup: 'bg-dark',
              title: 'text-white',
              htmlContainer: 'text-white'
            }
          });
        } else {
          this.activosFijos.buscarRegistros(this.buscarActivos, this.selectedColumn).subscribe(registros => {
            if (registros == "") {
              Swal.fire({
                title: 'ERROR',
                text: `NO SE ENCONTRÓ EL REGISTRO ${this.buscarActivos} de la columna ${this.selectedColumn}`,
                icon: 'error',
                customClass: {
                  popup: 'bg-dark',
                  title: 'text-white',
                  htmlContainer: 'text-white'
                }
              });
            } else {
              this.guardarAllMovimientos = registros;
            }
          });
        }
      }else{
        this.activosFijos.buscarRegistros(this.buscarActivos,this.selectedColumn).subscribe(registros=>{

          if(registros == ""){
            Swal.fire({
              title: 'ERROR',
              text: `NO SE ENCONTRO EL REGISTRO ${this.buscarActivos} de la columna ${this.selectedColumn}`,
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });
          }else{
            this.guardarAllMovimientos = registros
          }

        })
      }



    }

  }

  //funcion que crea nuevos inputs para buscar ont para agregarla a las actas de movimiento
  addInput() {

    if (this.RazonMovimiento == "") {

      Swal.fire({
        title: 'ERROR',
        text: `Ingrese una razon de movimiento primero`,
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

    } else {

      if (this.RazonMovimiento != '9' && this.RazonMovimiento != '10') {

        this.dynamicInputs.push(""); // Agregar un nuevo objeto al arreglo
        this.infoTextoActivosFijos = true;
        //esto es para limitar el boton de agregar ont en las instalaciones
        this.anular = false;

      } else {
        this.infoTextoActivosFijos = true;
        if (this.dynamicInputs[this.dynamicInputs.length - 1] !== '') {
          this.dynamicInputs.push(""); // Agregar un nuevo objeto al arreglo


        }

      }

    }

  }

  //funcion que elimina inputs
  eliminarInput(index: number) {
    this.dynamicInputs.splice(index, 1); // Eliminar el input del arreglo dynamicInputs
    this.resultadosPorInput.splice(index, 1); // Eliminar el resultado correspondiente
    this.guardarValorOnts.splice(index, 1); // Eliminar el valor guardado correspondiente
    this.anular = false;

    if(this.dynamicInputs.length == 0){
      this.infoTextoActivosFijos = false
    }

  }

  //funcion que busca la ont por el id en los inputs que se crean
  searchONTs(value: string, index: number) {

    if (value == "") {
      this.miInput.nativeElement.focus();
      Swal.fire({
        title: 'ERROR',
        text: `Ingrese un valor a buscar`,
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });
    } else {

      if (this.usuario.data.nombres == "alcala1") {

        if(this.RazonMovimiento == '15'){

          if(this.BodegaSale == "" || this.BodegaSale == null ){

            Swal.fire({
              title: 'ERROR',
              text: `Por favor llene todos los campos primero antes de buscar un activo fijo`,
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });

          }else{

            this.activosFijos.buscarActivoFijoMover(value,this.RazonMovimiento,this.BodegaSale).subscribe(acta => {

              if (acta == "") {

                this.miInput.nativeElement.focus();
                Swal.fire({
                  title: 'ERROR',
                  text: `No existen registros con el numero ${value}`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });

                this.dynamicInputs[index] = "";


              } else {



                this.guardarActivosFijos = acta;

                if (this.guardarActivosFijos[0].estadoM == 1) {
                  this.miInput.nativeElement.focus();

                  Swal.fire({
                    title: 'ERROR',
                    text: `Este activo fijo ya se encuentra actualmente en un movimiento`,
                    icon: 'error',
                    customClass: {
                      popup: 'bg-dark',
                      title: 'text-white',
                      htmlContainer: 'text-white'
                    }
                  });

                  this.dynamicInputs[index] = "";


                } else {

                  if (this.guardarValorOnts.includes(this.guardarActivosFijos[0].idactivoFijo)) {

                    Swal.fire({
                      title: 'ERROR',
                      text: `El valor ya ha sido ingresado en otro campo.`,
                      icon: 'error',
                      customClass: {
                        popup: 'bg-dark',
                        title: 'text-white',
                        htmlContainer: 'text-white'
                      }
                    });
                  } else {
                    this.guardarValorOnts[index] = this.guardarActivosFijos[0].idactivoFijo;
                    this.resultadosPorInput[index] = this.guardarActivosFijos[0];


                  }



                }

              }


            })

          }

        }else{

          if(this.BodegaEntra == "" || this.BodegaSale == ""){
            Swal.fire({
              title: 'ERROR',
              text: `Por favor llene todos los campos primero antes de buscar un activo fijo`,
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });
          }else{
            this.activosFijos.buscarActivoFijoMover(value,this.RazonMovimiento,this.BodegaSale).subscribe(acta => {

              if (acta == "") {

                this.miInput.nativeElement.focus();
                Swal.fire({
                  title: 'ERROR',
                  text: `No existen registros con el numero ${value}`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });

                this.dynamicInputs[index] = "";


              } else {



                this.guardarActivosFijos = acta;

                if (this.guardarActivosFijos[0].estadoM == 1) {
                  this.miInput.nativeElement.focus();

                  Swal.fire({
                    title: 'ERROR',
                    text: `Este activo fijo ya se encuentra actualmente en un movimiento`,
                    icon: 'error',
                    customClass: {
                      popup: 'bg-dark',
                      title: 'text-white',
                      htmlContainer: 'text-white'
                    }
                  });

                  this.dynamicInputs[index] = "";


                } else {

                  if (this.guardarValorOnts.includes(this.guardarActivosFijos[0].idactivoFijo)) {

                    Swal.fire({
                      title: 'ERROR',
                      text: `El valor ya ha sido ingresado en otro campo.`,
                      icon: 'error',
                      customClass: {
                        popup: 'bg-dark',
                        title: 'text-white',
                        htmlContainer: 'text-white'
                      }
                    });
                  } else {
                    this.guardarValorOnts[index] = this.guardarActivosFijos[0].idactivoFijo;
                    this.resultadosPorInput[index] = this.guardarActivosFijos[0];


                  }



                }

              }


            })
          }

        }





      } else {

        this.activosFijos.buscarActivoFijoMoverTecnicos(value).subscribe(acta => {

          if (acta == "") {


            Swal.fire({
              title: 'ERROR',
              text: `No existen registros con el numero ${value} `,
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });




          } else {

            this.guardarActivosFijos = acta;

            if (this.guardarActivosFijos[0].estadoM == 1) {


              Swal.fire({
                title: 'ERROR',
                text: `Este activo fijo ya se encuentra actualmente en un movimiento `,
                icon: 'error',
                customClass: {
                  popup: 'bg-dark',
                  title: 'text-white',
                  htmlContainer: 'text-white'
                }
              });

              this.dynamicInputs[index] = "";

            } else {

              if (this.guardarValorOnts.includes(this.guardarActivosFijos[0].idactivoFijo)) {
                console.log("Valor duplicado:", this.guardarActivosFijos[0].idactivoFijo);

                Swal.fire({
                  title: 'ERROR',
                  text: `El valor ya ha sido ingresado en otro campo.`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });
              } else {
                this.guardarValorOnts[index] = this.guardarActivosFijos[0].idactivoFijo;
                this.resultadosPorInput[index] = this.guardarActivosFijos[0];
              }

              console.log(`Buscando ONTs para el valor: ${value}`);

            }

          }


        })


      }

    }





  }

  //FUNCION QUE CREA LAS ACTAS DE MOVIMIENTOS
  crearActa() {

    if (this.RazonMovimiento == '5' || this.RazonMovimiento == '6' || this.RazonMovimiento == '7' || this.RazonMovimiento == '8') {

      if (this.BodegaEntra == "" || this.BodegaEntra == null || this.BodegaSale == ""  || this.BodegaSale == null ) {
        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE LOS CAMPOS',
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

            this.activosFijos.postActaDeMovimiento(this.RazonMovimiento, this.TipoEntrega, this.BodegaEntra, this.BodegaSale, this.Descripcion, this.GuiaTrasportadora, this.archivoCapturado, this.guardarValorOnts,this.ServicioDelClienteEspecifico).subscribe((crear: any) => {


              if (crear.length >= 1) {

                Swal.fire({
                  title: 'ERROR',
                  text: `LA BODEGA DE  ${this.valorNombreBodega.toLocaleUpperCase()} YA CUENTA CON UNA ACTA PENDIENTE`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });
              } else {
                this.limpiar()

                this.formData = "";
                localStorage.removeItem(`borradorFormulario_${this.usuario.data.idusuario}`);

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
                this.BodegaSale = "";
                this.mostrarInfoClienteRetirar = false;
                this.ocultarBotonBorrarCliente = false;
                this.ocultarBotonBuscarCliente = true;
                this.desahibilitarBuscarCliente = false;
                this.condicionVariosServiciosCliente = false
                this.infoTextoActivosFijos = false;
                this.ocultarNombreCompletoTecnico = false;
                this.condicionOcultarBodegaEntra = false;
                this.condicionRetiro = false;
              }

            })

          }
        })

      }



    } else if (this.RazonMovimiento == '1' || this.RazonMovimiento == '2' || this.RazonMovimiento == '3' || this.RazonMovimiento == '4' || this.RazonMovimiento == '19') {



      if (this.BodegaEntra == "" || this.BodegaEntra == null  || this.BodegaSale == "" || this.BodegaSale == null || this.guardarValorOnts.length == 0) {
        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE LOS CAMPOS',
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

            this.activosFijos.postActaDeMovimiento(this.RazonMovimiento, this.TipoEntrega, this.BodegaEntra, this.BodegaSale, this.Descripcion, this.GuiaTrasportadora, this.archivoCapturado, this.guardarValorOnts,this.ServicioDelClienteEspecifico).subscribe((crear: any) => {

              if(crear.length >= 1) {

                Swal.fire({
                  title: 'ERROR',
                  text: `El numero de servicio  ${this.BodegaEntra} YA CUENTA CON UNA ACTA PENDIENTE`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });


              }else{
                this.limpiar()

                this.formData = "";
                this.ocultarNombreCompletoTecnico = false;
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
                this.mostrarInfoClienteInstalar = false;
                this.condicionBodegaSale = false;
                this.condicionEntraBodega = false;
                this.ocultarBotonBuscarClienteInstalacion = false;
                this.ocultarBotonBorrarClienteInstalacion = false;
              }

            })

          }
        })

      }

    } else if (this.RazonMovimiento == '9' || this.RazonMovimiento == '10' ||  this.RazonMovimiento == '20') {

      if (this.BodegaEntra == ""  || this.BodegaEntra == null || this.BodegaSale == "" || this.BodegaSale == null || this.guardarValorOnts.length == 0) {




        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE LOS CAMPOS',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });


      } else if (this.TipoEntrega == '2') {

        if (this.GuiaTrasportadora == "" || this.BodegaEntra == "" || this.BodegaEntra == null || this.BodegaSale == "" || this.BodegaSale == null || this.guardarValorOnts.length == 0) {

          Swal.fire({
            title: 'ERROR',
            text: 'POR FAVOR LLENE LOS CAMPOS',
            icon: 'error',
            customClass: {
              popup: 'bg-dark',
              title: 'text-white',
              htmlContainer: 'text-white'
            }
          });

        } else if (this.archivoCapturado == null) {

          Swal.fire({
            title: 'ERROR',
            text: 'POR FAVOR CARGUE LA IMAGEN DE LA GUIA',
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

              this.activosFijos.postActaDeMovimiento(this.RazonMovimiento, this.TipoEntrega, this.BodegaEntra, this.BodegaSale, this.Descripcion, this.GuiaTrasportadora, this.archivoCapturado, this.guardarValorOnts,this.ServicioDelClienteEspecifico).subscribe((crear: any) => {


                if (crear.length >= 1) {

                  Swal.fire({
                    title: 'ERROR',
                    text: `LA BODEGA DE  ${this.valorNombreBodega.toLocaleUpperCase()} YA CUENTA CON UNA ACTA PENDIENTE`,
                    icon: 'error',
                    customClass: {
                      popup: 'bg-dark',
                      title: 'text-white',
                      htmlContainer: 'text-white'
                    }
                  });
                } else {
                  this.limpiar()

                  this.formData = "";
                  localStorage.removeItem(`borradorFormulario_${this.usuario.data.idusuario}`);

                  this.ngOnInit();
                  this.ocultarNombreCompletoTecnico = false;
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

              })

            }
          })


        }

      } else {

        console.log(this.BodegaEntra);

        Swal.fire({
          title: '¿Estás seguro?',
          text: `Por favor Verifique que la informacion este correcta, ya que no podra modificar la informacion despues de crear el acta!`,
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
            this.activosFijos.postActaDeMovimiento(this.RazonMovimiento, this.TipoEntrega, this.BodegaEntra, this.BodegaSale, this.Descripcion, this.GuiaTrasportadora, this.archivoCapturado, this.guardarValorOnts,this.ServicioDelClienteEspecifico).subscribe((crear: any) => {


              if (crear.length >= 1) {

                Swal.fire({
                  title: 'ERROR',
                  text: `LA BODEGA DE  ${this.valorNombreBodega.toLocaleUpperCase()} YA CUENTA CON UNA ACTA EN ESTADO PENDIENTE`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });

              } else {

                this.limpiar()

                this.formData = "";
                localStorage.removeItem(`borradorFormulario_${this.usuario.data.idusuario}`);
                this.ngOnInit();
                this.ocultarNombreCompletoTecnico = false;
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

            })
          }
        })




      }

    }else if (this.RazonMovimiento == '14' || this.RazonMovimiento == '18' || this.RazonMovimiento == '17'){

      if (this.BodegaEntra == "" || this.BodegaEntra == null || this.BodegaSale == "" || this.BodegaSale == null || this.guardarValorOnts.length == 0) {
        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE LOS CAMPOS',
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

            this.activosFijos.postActaDeMovimiento(this.RazonMovimiento, this.TipoEntrega, this.BodegaEntra, this.BodegaSale, this.Descripcion, this.GuiaTrasportadora, this.archivoCapturado, this.guardarValorOnts,this.ServicioDelClienteEspecifico).subscribe((crear: any) => {


              if(crear.length >= 1) {

                Swal.fire({
                  title: 'ERROR',
                  text: `El numero de servicio  ${this.valorNombreBodega} YA CUENTA CON UNA ACTA PENDIENTE`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });


              }else{
                this.limpiar()

                this.formData = "";


                this.ngOnInit();
                this.ocultarNombreCompletoTecnico = false;
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

            })

          }
        })

      }



    }else if(this.RazonMovimiento == '15'){

      if ( this.BodegaSale == "" || this.BodegaSale == null || this.guardarValorOnts.length == 0) {
        Swal.fire({
          title: 'ERROR',
          text: 'POR FAVOR LLENE LOS CAMPOS',
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

            this.activosFijos.postActaDeMovimiento(this.RazonMovimiento, this.TipoEntrega, this.BodegaEntra, this.BodegaSale, this.Descripcion, this.GuiaTrasportadora, this.archivoCapturado, this.guardarValorOnts,this.ServicioDelClienteEspecifico).subscribe((crear: any) => {


              if(crear.length >= 1) {

                Swal.fire({
                  title: 'ERROR',
                  text: `El numero de servicio  ${this.valorNombreBodega} YA CUENTA CON UNA ACTA PENDIENTE`,
                  icon: 'error',
                  customClass: {
                    popup: 'bg-dark',
                    title: 'text-white',
                    htmlContainer: 'text-white'
                  }
                });


              }else{
                this.limpiar()

                this.formData = "";


                this.ngOnInit();
                this.ocultarNombreCompletoTecnico = false;
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

            })

          }
        })

      }

    }



  }

  //FUNCION QUE CAPTURA LA IMAGEN QUE EL USUARIO CARGA
  capturarImagen(event: any) {

    this.archivoCapturado = event.target.files[0];

    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (allowedTypes.includes(selectedImage.type)) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.savedImage = e.target.result;
        };
        reader.readAsDataURL(selectedImage);
      } else {

        Swal.fire({
          title: 'ERROR',
          text: 'FORMATO DE LA IMAGEN NO VALIDO POR FAVOR USE UN FORMATO JPG PNG O JPEG',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

        event.target.value = '';
      }


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

  //funcion solo para reinciar la paginacion a 1 por si se actualiza la pagina
  actualizarPaginacion() {
    // Reiniciar la paginación a la primera página cuando se cambie la cantidad de registros por página
    this.page = 1;
  }

  //funcion que permite visualizar en otra pestaña la imagen una vez se le da click en la tabla para abrila
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

  //funcion que acepta al acta de movimiento y se realizan los respectivos movimientos del acta en las bodegas
  aceptarActa(idActa: string, servicio: string, servicioSale: string,numTercero:string,tipoMovimiento:string) {

    this.activosFijos.aceptarActa(idActa, servicio, servicioSale,numTercero,tipoMovimiento).subscribe((validarActa: any) => {

      this.RazonMovimiento = "";

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









    })
  }

  //funcion que rechaza el acta y no se realiza ningun movimiento entre bodegas
  anularActa(idActa: string, servicio: string,numTercero:string,tipoMovimiento:string) {

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
        this.razonAnulacion = result.value;

        this.activosFijos.anularActa(idActa, servicio, this.razonAnulacion,numTercero,tipoMovimiento).subscribe((validarActa: any) => {
          this.ngOnInit();


          Swal.fire({
            title: 'EXITO',
            text: 'ACTA ANULADA CON EXITO',
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

  //funcion que uso para dependiendo de la operacion de la acta instalacion retiro devolucion a central etc mostrar mas inputs o mostrar menos saber cuales son obligatorios cuales no etc
  validarCampos(evento: any) {
    this.guardarServicioTecnicos = [];
    this.ngOnInit();
    this.BodegaSale = "";
    this.BodegaEntra = "";
    const selectedIndex = evento.selectedIndex;
    this.valorNombreBodega = evento.options[selectedIndex].text;


    this.guardarServicio = [];

    this.TipoEntrega = "";
    this.dynamicInputs = [];
    this.resultadosPorInput = [];
    this.guardarValorOnts = [];

    if (this.valorNombreBodega == "Retiro Final" || this.valorNombreBodega == 'Retiro Soporte' || this.valorNombreBodega == 'Retiro Migración' || this.valorNombreBodega == 'Retiro Traslado') {

      this.ocultarNombreCompletoTecnico = false
      this.ocultarBotonBuscarCliente = true;
      this.condicionRetiro = true;
      this.condicionOcultarBodegaEntra = true;
      this.ServicioDelClienteEspecifico = "";
      this.BodegaSale = "";
      this.BodegaEntra = "";
      this.infoTextoActivosFijos = false;
      this.mostrarInfoClienteInstalar = false;
      this.ocultarBotonCrearActa = false;
      this.condicionEntraBodega = false;
      this.condicionBodegaSale = false;
      this.mostrarInfoClienteRetirar = false;
      this.condicionVariosServiciosCliente = false;
      this.ocultarBotonBorrarCliente = false;
     this.desahibilitarBuscarCliente = false;
     this.ocultarBotonBuscarClienteInstalacion = false;
     this.ocultarBotonBorrarClienteInstalacion = false;

    } else if (this.valorNombreBodega == 'Instalación Inicial' || this.valorNombreBodega == 'Instalación Traslado' || this.valorNombreBodega == 'Instalación Migración' || this.valorNombreBodega == 'Instalación Soporte') {


      this.mostrarInfoClienteInstalar = false;
      this.ocultarBotonBorrarClienteInstalacion = false;
      this.ocultarNombreCompletoTecnico = false
      this.condicionEntraBodega = true;
      this.condicionBodegaSale = true;
      this.mostrarInfoClienteRetirar = false;
      this.condicionVariosServiciosCliente = false;
      this.ServicioDelClienteEspecifico = "";
      this.infoTextoActivosFijos = false;
      this.BodegaSale = "";
      this.BodegaEntra = "";
      this.condicionRetiro = false;
      this.condicionOcultarBodegaEntra = false;
      this.ocultarBotonBuscarCliente = false;
      this.ocultarBotonBuscarClienteInstalacion = true;
      this.ocultarBotonBorrarCliente = false;
      this.desahibilitarBuscarCliente = false;




    } else if(this.valorNombreBodega == 'Ajuste Inventario Salida') {
      this.guardarServicioTecnicos = [];
      this.ocultarNombreCompletoTecnico = false;
      this.infoTextoActivosFijos = false;
      this.BodegaSale = "";
      this.BodegaEntra = "";

      this.activosFijos.getBodegaAjusteInventario().subscribe( response => {

        this.guardarServicioTecnicos = response

      });


      this.condicionOcultarBodegaEntra = true;
      this.condicionBodegaSale = true;
      this.condicionEntraBodega = false;
      this.ServicioDelClienteEspecifico = "";
      this.condicionVariosServiciosCliente = false;
      this.ocultarBotonBorrarCliente = false;
     this.desahibilitarBuscarCliente = false;
     this.mostrarInfoClienteRetirar = false;
     this.condicionRetiro = false;

    } else if(this.valorNombreBodega == 'Venta Salida'){
      this.BodegaSale = "";
      this.BodegaEntra = "";
      this.ocultarNombreCompletoTecnico = false;
      this.operacionInputsValidar = false;
      this.condicionOcultarBodegaEntra = false;
      this.condicionEntraBodega = false;
      this.condicionRetiro = false;
      this.condicionBodegaSale = true;

    } else if(this.valorNombreBodega == 'Ajuste Inventario Ingreso'){
      this.guardarServicioTecnicos = [];
      this.guardarServicioTecnicos = "";
      this.BodegaSale = "";
      this.BodegaEntra = "";
      this.ocultarNombreCompletoTecnico = false;
      this.infoTextoActivosFijos = false;

      this.activosFijos.getBodegaAjusteInventarioIngreso().subscribe( response => {

        this.guardarServicioTecnicos = response




      });


      this.condicionOcultarBodegaEntra = true;
      this.condicionBodegaSale = true;
      this.condicionEntraBodega = false;
      this.ServicioDelClienteEspecifico = "";
      this.condicionVariosServiciosCliente = false;
      this.ocultarBotonBorrarCliente = false;
      this.desahibilitarBuscarCliente = false;
      this.mostrarInfoClienteRetirar = false;
      this.condicionRetiro = false;


    }else if(this.valorNombreBodega == 'Reconexion'){
      this.ocultarBotonBorrarClienteInstalacion = false;
      this.ocultarNombreCompletoTecnico = false;
      this.BodegaSale = "";
      this.BodegaEntra = "";
      this.ocultarBotonBuscarClienteInstalacion = true;
      this.mostrarInfoClienteInstalar = false;
      this.condicionEntraBodega = true;
      this.condicionBodegaSale = true;
      this.mostrarInfoClienteRetirar = false;
      this.condicionVariosServiciosCliente = false;
      this.ServicioDelClienteEspecifico = "";
      this.infoTextoActivosFijos = false;
      this.BodegaSale = "";
      this.BodegaEntra = "";


      this.condicionRetiro = false;
      this.condicionOcultarBodegaEntra = false;
      this.ocultarBotonBuscarCliente = false;
      this.ocultarBotonBorrarCliente = false;
      this.desahibilitarBuscarCliente = false;

    }else{
      this.ocultarBotonBorrarClienteInstalacion = false;
      this.mostrarInfoClienteInstalar = false;
      this.BodegaSale = "";
      this.BodegaEntra = "";
      this.ocultarBotonBuscarClienteInstalacion = false;
      this.condicionOcultarBodegaEntra = true;
      this.condicionBodegaSale = true;
      this.condicionEntraBodega = false;
      this.ServicioDelClienteEspecifico = "";
      this.condicionVariosServiciosCliente = false;
      this.ocultarBotonBorrarCliente = false;
     this.desahibilitarBuscarCliente = false;
     this.mostrarInfoClienteRetirar = false;
     this.condicionRetiro = false;
     this.infoTextoActivosFijos = false;
    }
    this.BodegaSale = "";
    this.BodegaEntra = "";




    this.anular = false;
    this.activosFijos.getBodegas(this.valorNombreBodega).subscribe(Bodegas => {

      this.guardarServicio = Bodegas;
      console.log(this.guardarServicio);

    })

    if (evento.value == 9 || evento.value == 10) {

      this.operacionInputsValidar = true;
      this.ocultarBotonBuscarCliente = false;

    } else {
      this.operacionInputsValidar = false;
      this.operacionInputsTipo = false;
    }



  }

  validarTipo(evento: any) {

    if (evento.value == 2) {
      this.operacionInputsTipo = true;
    } else {
      this.operacionInputsTipo = false;
      this.GuiaTrasportadora = ""
      this.archivoCapturado = null;
      this.savedImage = ""
    }
  }


  //funcion que limpia todos los inputs a la hora de crear un acta de movimiento
  limpiar() {
    this.BodegaEntra = "";
    this.BodegaSale = "";
    this.GuiaTrasportadora = "";
    this.RazonMovimiento = "";
    this.Descripcion = "";
    this.ImgGuia = "";
    this.TipoEntrega = "";
    this.archivoCapturado = null;
    this.operacionInputsValidar = false;
    this.operacionInputsTipo = false;
    this.dynamicInputs = [];
    this.guardarValorOnts = [];
    this.resultadosPorInput = [];
    this.savedImage = "";

    this.guardarTiposDeMovimientos = [];
    this.guardarServicioTecnicos = [];
  }


  //funcion que sirve para visualizar en una ventana modal las ont que estan vinculas a una acta de movimiento ya sea en estado acetada pendiente o rechazada
  verOntsDeLasActas(idActa: string) {

    this.botonesPresionados[idActa] = true;
    this.idActaActualBotonVer = idActa;

    this.activosFijos.getAllActas(idActa).subscribe(guardarActa => {
      this.guardarActa = guardarActa;

    })


  }

  //funcion para validar si mostrar los elementos inputs o no dependiendo de la opcion de la acta (otra validacion mas)
  trackByFn(index: number, item: any): any {
    return index;
  }


  buscarClienteInstalar() {


    if (this.BodegaEntra == "") {

      Swal.fire({
        title: 'ERROR',
        text: 'POR FAVOR INGRESE UN NUMERO DE SERVICIO',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });


    }else{

        this.activosFijos.obtenerClienteServicios(this.BodegaEntra).subscribe((res:any)=>{

           this.combinedData = {
            servicios: res.data
          };

          if(this.combinedData.servicios.length == 0){

            Swal.fire({
              title: 'ERROR',
              text: 'NO EXISTE ACTIVO FIJO PARA RETIRAR A ESTE CLIENTE',
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });

            this.condicionVariosServiciosCliente = false;

          } else {
            this.ocultarBotonBuscarClienteInstalacion = false;
            this.condicionBodegaSale = true;
            this.ocultarBotonCrearActa = true;
            this.condicionRetiro = false;
            this.mostrarInfoClienteInstalar = true;
            this.desahibilitarBuscarCliente = true;

            this.ocultarBotonBorrarClienteInstalacion = true;


          }


        })


    }
  }


  //funcion para buscar un cliente por medio de el numero de servicio a la hora de hacer un retiro de un activo fijo
  buscarCliente() {

    if (this.BodegaSale == "") {

      Swal.fire({
        title: 'ERROR',
        text: 'POR FAVOR INGRESE UN NUMERO DE SERVICIO',
        icon: 'error',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });


    }else{

      this.activosFijos.buscarCliente(this.BodegaSale).subscribe((cliente:any) => {

        this.guardarClienteRetirar = cliente;

        console.log( this.guardarClienteRetirar);

        this.activosFijos.obtenerClienteServicios(this.BodegaSale).subscribe((res:any)=>{

          console.log(res);

           this.combinedData = {
            cliente: this.guardarClienteRetirar,
            servicios: res.data
          };

          console.log(this.combinedData);


          if( this.guardarClienteRetirar.length>1){


            this.condicionVariosServiciosCliente = true;
            this.guardarServiciosClientesEspecificos =  this.guardarClienteRetirar

          }else if(this.guardarClienteRetirar.error == "Cliente no encontrado" || this.guardarClienteRetirar == ""){

            Swal.fire({
              title: 'ERROR',
              text: 'NO EXISTE ACTIVO FIJO PARA RETIRAR A ESTE CLIENTE',
              icon: 'error',
              customClass: {
                popup: 'bg-dark',
                title: 'text-white',
                htmlContainer: 'text-white'
              }
            });

            this.condicionVariosServiciosCliente = false;

          } else {

            this.ocultarBotonBorrarCliente = true;

            this.ocultarBotonBuscarCliente = false;

            this.condicionVariosServiciosCliente = false;
            this.BodegaSale = this.combinedData.servicios.numeroservicio
            this.guardarValorOnts = this.combinedData.cliente[0].numeroActivo
            this.ocultarBotonCrearActa = true;
            this.mostrarInfoClienteRetirar = true;
            this.desahibilitarBuscarCliente = true;




          }


        })



      })
    }
  }

  //funcion que obtiene varios equipos en el caso de que el numero de servicio tenga mas de 1 equipo en este caso se mostraran todos los equipos en una select para que el usuario selecione cual retirar
  servicioEspecificoCliente() {

    this.activosFijos.buscarClienteEspecifico(this.ServicioDelClienteEspecifico,this.BodegaSale).subscribe((cliente:any) => {

      this.guardarClienteRetirar = cliente;

      this.combinedData = {
        servicios: this.combinedData.servicios,
        cliente: this.guardarClienteRetirar
      }



      if (this.guardarClienteRetirar.error == "Cliente no encontrado" || this.guardarClienteRetirar == "") {

        Swal.fire({
          title: 'ERROR',
          text: 'NO EXISTE ACTIVO FIJO PARA RETIRAR A ESTE CLIENTE',
          icon: 'error',
          customClass: {
            popup: 'bg-dark',
            title: 'text-white',
            htmlContainer: 'text-white'
          }
        });

      } else {
        this.ocultarBotonCrearActa = true;
        this.mostrarInfoClienteRetirar = true;
        this.desahibilitarBuscarCliente = true;
        this.ocultarBotonBuscarCliente = false;
        this.ocultarBotonBorrarCliente = true;
      }

    })


  }

  //funcion que reinicia el proceso qe se llevaba de la creacion del acta para buscar otro cliente por el numero de servicio
  buscarOtroCliente() {

    this.condicionRetiro = true;

    this.ocultarBotonBorrarCliente = false;
    this.desahibilitarBuscarCliente = false;
    this.ocultarBotonBuscarCliente = true;
    this.guardarClienteRetirar = [];
    this.mostrarInfoClienteRetirar = false;
    this.BodegaSale = "";
    this.guardarServiciosClientesEspecificos = "";
    this.condicionVariosServiciosCliente = false;
    this.ServicioDelClienteEspecifico = "";
    this.ocultarBotonCrearActa = false;
  }

  buscarOtroClienteInstalacion(){

    this.mostrarInfoClienteInstalar = false;
    this.ocultarBotonBorrarCliente = false;
    this.desahibilitarBuscarCliente = false;
    this.guardarClienteRetirar = [];
    this.mostrarInfoClienteRetirar = false;
    this.guardarServiciosClientesEspecificos = "";
    this.condicionVariosServiciosCliente = false;
    this.ServicioDelClienteEspecifico = "";
    this.ocultarBotonCrearActa = false;
    this.ocultarBotonBuscarClienteInstalacion = true;
    this.ocultarBotonBorrarClienteInstalacion = false;
    this.BodegaEntra = "";
  }

  //funcion que sirve para filtrar todo en el buscador
  filtroLimpiar(evento: any){

    const selectedIndex = evento.options[evento.selectedIndex].text;

    if(selectedIndex == "Filtrar todo"){
      this.ngOnInit();
      this.buscarActivos = ""

      this.dashabilitarBuscador = true;

    }else{
      this.dashabilitarBuscador = false;
    }


  }

  //funcion que genera un reporte en excel dependiendo de lo que se este viendo en la tabla
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
        const datosReporte:any[] = this.guardarAllMovimientos;

        const datosReporteSinIdActivoFijo = datosReporte.map(item => {
          const newItem = { ...item };
          delete newItem.idactaMovimiento;
          delete newItem.imgGuiaTrans;
          delete newItem.validarActa;
          delete newItem.entraCliente;
          delete newItem.saleCliente;
          delete newItem.numTercero;
          return newItem;
        });

        const promises = datosReporteSinIdActivoFijo.map((item, index) => {
          return this.activosFijos.getAllActas(this.guardarAllMovimientos[index].idactaMovimiento).toPromise().then(guardarActa => {
            if (Array.isArray(guardarActa)) {
              item['onts'] = guardarActa.map(ont => `${ont.numeroActivo}`).join(', ');
            } else {
              item['onts'] = ''; // O alguna otra acción adecuada si guardarActa no es un array
            }
          }).catch(error => {
            console.error("Error al obtener las actas: ", error);
            item['onts'] = ''; // O alguna otra acción adecuada si hay un error al obtener las actas
          });
        });

        Promise.all(promises).then(() => {
          const columnOrder = ['razonMovimientocol', 'tipoEntrega', 'estadoActaMovimiento', 'tercerocolEntrada', 'tercerocolSalida', 'fechaRegistro', 'fechaValidacion', 'nombreUsuarioRegistra', 'nombreUsuarioValida', 'guiaTransportadora', 'obsActaRecha', 'descripcion', 'onts'];

          const datosReporteConOrden = datosReporteSinIdActivoFijo.map(item => {
            const newItem: any = {};
            columnOrder.forEach(prop => {
              newItem[prop] = item[prop];
            });
            return newItem;
          });

          console.log(datosReporteConOrden);

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(datosReporteConOrden);
          console.log(ws);

          const columnStyles = [
            { width: 20 }, { width: 15 }, { width: 15 }, { width: 20 }, { width: 20 },
            { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 }, { width: 20 },
            { width: 20 }, { width: 20 }
          ];

          const colInfo = { wch: 20 };

          columnStyles.forEach((style, columnIndex) => {
            const col = XLSX.utils.encode_col(columnIndex);
            if (!ws['!cols']) {
              ws['!cols'] = [];
            }
            ws['!cols'].push({ ...colInfo, ...style });
          });

          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'InformeInventarioActas');

          XLSX.writeFile(wb, 'InformeInventarioActas.xlsx');
        }).catch(error => {
          console.error("Error al generar el reporte: ", error);
        });
      }
    });
  }

  borrarSeleccion(){
    this.ocultarNombreCompletoTecnico = false
  }

  confirmarActivoFijo(numeroActivo: number): void {
    const index = this.clickedActivos.indexOf(numeroActivo);
    if (index > -1) {
      // Si el elemento ya está en la lista, quítalo
      this.clickedActivos.splice(index, 1);
    } else {
      // Si el elemento no está en la lista, agrégalo
      this.clickedActivos.push(numeroActivo);
    }
  }


  cambiarColorPredeterminadoBotonVer(){

    if (this.idActaActualBotonVer) {
      this.botonesPresionados[this.idActaActualBotonVer] = false;
      this.idActaActualBotonVer = null;
    }


  }

}



