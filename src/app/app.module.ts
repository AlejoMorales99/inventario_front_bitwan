import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ConsultarInventarioComponent } from './consultar-inventario/consultar-inventario.component';


//Imports necesarios para el funcionamiento del sistema
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { EditarActivoFijoComponent } from './consultar-inventario/editarActivoFijo/editar-activo-fijo/editar-activo-fijo.component';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { ActivosFijosService } from './services/activosFijos/activos-fijos.service';
import { ArticulosInventarioService } from './services/articulos/articulos-inventario.service';
import { OrderModule } from 'ngx-order-pipe';
import { DataTablesModule } from "angular-datatables";
import { ReferenciasComponent } from './referencias/referencias/referencias.component';
import { WifiComponent } from './wifi/wifi.component';
import { NodosComponent } from './nodos/nodos.component';
import { MarcasComponent } from './marcas/marcas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { EstadosComponent } from './estados/estados.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ActaMovimientoComponent } from './actaMovimiento/acta-movimiento/acta-movimiento.component';
import { NgSelectModule } from '@ng-select/ng-select';


import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TecnicosComponent } from './tecnicos/tecnicos/tecnicos.component';
import { EditarReferenciaComponent } from './referencias/editarReferencia/editar-referencia/editar-referencia.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TipoEquipoComponent } from './tipoEquipo/tipo-equipo/tipo-equipo.component';
import { EditarWifiComponent } from './wifi/editarWifi/editar-wifi/editar-wifi.component';
import { EditarNodoComponent } from './nodos/editarNodo/editar-nodo/editar-nodo.component';
import { EditarMarcaComponent } from './marcas/editarMarca/editar-marca/editar-marca.component';
import { EditarCategoriaComponent } from './categorias/editarCategoria/editar-categoria/editar-categoria.component';
import { EditarEstadoComponent } from './estados/editarEstado/editar-estado/editar-estado.component';
import { EditarProveedorComponent } from './proveedores/editarProveedor/editar-proveedor/editar-proveedor.component';
import { EditarTipoDeEquipoComponent } from './tipoEquipo/editarTipoDeEquipo/editar-tipo-de-equipo/editar-tipo-de-equipo.component';
import { InventarioInsumosComponent } from './inventarioInsumos/inventario-insumos/inventario-insumos.component';
import { ActaMovimientoInsumosComponent } from './actaMovimientoInsumos/acta-movimiento-insumos/acta-movimiento-insumos.component';




const appRoutes: Routes = [

  //ruta con la que se inicia la app (login)
  { path: '' , component: LoginComponent},

  //primera ruta a mostrar cuando el usuario inicia sesion
  { path: 'inicio' , component: InicioComponent},

  //ruta donde se muestra la vista de los activos fijos de la base de datos de mysql
  { path: 'inventarioActivosFijos' , component: ConsultarInventarioComponent},

  //ruta para acceder al inventario de insumos
  { path: 'inventarioInsumos' , component: InventarioInsumosComponent},

  //ruta para acceder al inventario de las referencias de los equipos
  { path: 'referenciasActivosFijos' , component: ReferenciasComponent},

  //ruta para editar una referencia de algun equipo del inventario
  { path: 'referenciasActivosFijosEditar/:id' , component: EditarReferenciaComponent},

  //ruta para acceder al inventario de las bandas de frecuencia del inventario
  { path: 'wifi' , component: WifiComponent},

  //ruta para editar un registro de las bandas de frecuencia del inventario
  { path: 'wifiEditar/:id' , component: EditarWifiComponent},

  //ruta para acceder al inventario de los nodos del de inventario (tipo de conexion)
  { path: 'Nodos' , component: NodosComponent},

  //ruta para editar un registro de los nodos del inventario (tipo de conexion)
  { path: 'NodoEditar/:id' , component: EditarNodoComponent},



  //ruta para acceder al inventario de las marcas del inventario
  { path: 'marca' , component: MarcasComponent},

  //ruta para editar un registro de las marcas del inventario de la empresa
  { path: 'marcaEditar/:id' , component: EditarMarcaComponent},

  //ruta para acceder al inventario de los diferentes estados de un equipo del inventario
  { path: 'estados' , component: EstadosComponent},

  //ruta para editar un registro del inventario de estados de los registros de la empresa
  { path: 'editarEstados/:id' , component: EditarEstadoComponent},

  //ruta para accerder a las diferentes categorias de un equipo del inventario de  la empresa
  { path: 'categorias' , component: CategoriasComponent},

  //ruta para editar una categoria de algun equipo del inventario de la empresa
  { path: 'categoriasEditar/:id' , component: EditarCategoriaComponent},

  //ruta para acceder a la informacion de los proveedores del inventario la empresa
  { path: 'proveedores' , component: ProveedoresComponent},

  //ruta para editar un proveedor del inventario de la empresa
  { path: 'editarProveedores/:id' , component: EditarProveedorComponent},

  //ruta para acceder a los diferentes tipos de equipo del inventario de la empresa
  { path: 'tipoEquipo' , component: TipoEquipoComponent},

  //ruta para editar un tipo de equipo del inventario de la empresa
  { path: 'editarEquipo/:id' , component: EditarTipoDeEquipoComponent},

  //ruta para editar un activo fijo (router,antena,poe) del inventario de la empresa
  { path: 'editarActivoFijo/:id' , component: EditarActivoFijoComponent},

  //ruta para acceder a todas las actas de movimiento de los activos fijos del inventario de la empresa
  { path: 'actasDeMovimiento' , component: ActaMovimientoComponent},

  //ruta para acedder a todas las actas de movimiento de los insumos del inventario de la empresa
  { path: 'actasDeMovimientoInsumos' , component: ActaMovimientoInsumosComponent},

  //ruta para acceder a todo el inventario de los tecnicos del inventario de la empresa
  { path: 'Tecnicos' , component: TecnicosComponent},


  { path: '**', redirectTo: '' } // Redirección a la ruta vacía para rutas no definidas

];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ConsultarInventarioComponent,
    InicioComponent,
    LoginComponent,
    EditarActivoFijoComponent,
    ReferenciasComponent,
    WifiComponent,
    NodosComponent,
    MarcasComponent,
    CategoriasComponent,
    EstadosComponent,
    ProveedoresComponent,
    ActaMovimientoComponent,
    TecnicosComponent,
    EditarReferenciaComponent,
    TipoEquipoComponent,
    EditarWifiComponent,
    EditarNodoComponent,
    EditarMarcaComponent,
    EditarCategoriaComponent,
    EditarEstadoComponent,
    EditarProveedorComponent,
    EditarTipoDeEquipoComponent,
    InventarioInsumosComponent,
    ActaMovimientoInsumosComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    Ng2SearchPipeModule,
    FormsModule,
    NgxPaginationModule,
    OrderModule,
    DataTablesModule,
    NgSelectModule,
    HttpClientModule,
    FontAwesomeModule, // Agrega FontAwesomeModule aquí
    NgProgressModule.withConfig({
      color: "blue"
    }),

    NgProgressHttpModule,

    BrowserAnimationsModule
  ],
  providers: [ActivosFijosService,ArticulosInventarioService],
  bootstrap: [AppComponent]
})
export class AppModule { }
