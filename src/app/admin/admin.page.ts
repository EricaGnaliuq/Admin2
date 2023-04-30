import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  user: Observable<DocumentChangeAction<any>[]>;

  u ={
    age:'',
    email:'',
    name:'',
    sex:'',
    type:'',
  }

  constructor(private firestore: AngularFirestore, public alertCtrl:AlertController) {
    this.user= this.firestore.collection('user').snapshotChanges();
   }

   getUsers(){
    this.user.subscribe(actions =>{
      actions.forEach(action =>{
        console.log(action.payload.doc.id,
          action.payload.doc.data().age,
          action.payload.doc.data().email,
          action.payload.doc.data().name,
          action.payload.doc.data().sex,
          action.payload.doc.data().type
          );
      });

    });
   }
   addUser(): void{
    this.firestore.collection('user').add(this.u)
    .then(()=>{
      console.log('User added successfully');
    });
   }

   async deleteUser(u: string){
    const alert = await this.alertCtrl.create({
      header: 'Are you sure you want to delete this user?',
      buttons:[
        {
          text:'Cancel',
          role: 'cancel',
          handler:()=>{
            alert.dismiss();
          }
        },
        {
          text: 'Confirm',
          role: 'confirm',
          handler:()=>{
            const userRef = this.firestore.collection('user').doc(u);
            userRef.delete().then(()=>{
              console.log('User deleted successfully!');
            }).catch(error =>{
              console.error('Error deleteng User',error);
            });
          }
        },
      ],
    });
    await alert.present();
   }

  ngOnInit() {
  }

}