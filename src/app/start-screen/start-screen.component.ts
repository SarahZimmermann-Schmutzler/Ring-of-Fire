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
    const coll = collection(this.firestore, 'games');
    addDoc(coll, game.toJson());
    // setDoc(doc(coll), game.toJson());
    // funktioniert beides, welches besser? add macht mehr sinn, setDoc im Vorkurs gelernt
    const docRef = doc(coll);
    let gameId = docRef['id'];
    // console.log(gameId);
    this.router.navigateByUrl('/game/'+ gameId);
  }
}
