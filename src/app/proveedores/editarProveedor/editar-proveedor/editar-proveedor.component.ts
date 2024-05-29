import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login/login.service';
import { ProveedorService } from 'src/app/services/proveedor/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-proveedor',
  templateUrl: './editar-proveedor.component.html',
  styleUrls: ['./editar-proveedor.component.css']
})
export class EditarProveedorComponent {

idProveedor: string = this.rutaActiva.snapshot.paramMap.get('id')!;

constructor(private rout: Router,private rutaActiva: ActivatedRoute, private proveedorServices:ProveedorService,private loginServices: LoginService){}

proveedor:string=""

ngOnInit(){

  const usuario = this.loginServices.getUser();

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
      text: 'NO TIENE PERMISOS PARA ACCERDER A ESTA RUTA',
      icon: 'error',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    });

    this.rout.navigate(['/inicio']);

  }else{

    this.proveedorServices.getOneProveedor(this.idProveedor).subscribe((res:any)=>{
      this.proveedor = res[0].nombre;
    })

  }



}

putProveedor(){

  if(this.proveedor==""){
    Swal.fire({
      title: 'ERROR',
      text: 'POR FAVOR LLENE EL CAMPO',
      icon: 'error',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    });
  }else if(this.proveedor.length>=15){
    Swal.fire({
      title: 'ERROR',
      text: 'POR FAVOR INGRESE UN VALOR CON UNA LONGITUD MENOR A 15 CARACTERES',
      icon: 'error',
      customClass: {
        popup: 'bg-dark',
        title: 'text-white',
        htmlContainer: 'text-white'
      }
    });
  }else{

    this.proveedorServices.putProveedor(this.idProveedor,this.proveedor).subscribe(res=>{

      Swal.fire({
        title: 'EXITO',
        text: 'REGISTRO ACTUALIZADO CON EXITO',
        icon: 'success',
        customClass: {
          popup: 'bg-dark',
          title: 'text-white',
          htmlContainer: 'text-white'
        }
      });

      this.rout.navigate(['/proveedores']);

    })


  }

}

}
