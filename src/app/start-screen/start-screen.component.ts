import { Component } from '@angular/core';
import { addDoc, collection, doc, docData, Firestore, getDoc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  
  constructor(private router: Router, private firestore: Firestore) {}

  async newGame() {
    //start game
    let game = new Game();

    // add collection and fetch it's id 
    const coll = collection(this.firestore, 'games');

    // A) Alternative mit setDoc
    // let docRef = doc(coll);
    // setDoc(docRef, game.toJson());
    // let docSnap = await getDoc(docRef);
    // let gameId = docSnap.id;
    // console.log('id is:', gameId);
    
    // B) Alternative mit addDoc
    let gameinfo = await addDoc(coll, game.toJson());
    // console.log('id is', gameinfo.id);
    
    this.router.navigateByUrl('/game/'+ gameinfo.id);
  }
}
