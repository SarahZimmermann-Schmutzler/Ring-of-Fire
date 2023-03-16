import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { addDoc, collection, doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard = '';
  game: Game;
  games$: Observable<any>;

  constructor(private firestore: Firestore, public dialog: MatDialog, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      let gameId = params['id'];
      // console.log(gameId);
      const coll = collection(this.firestore, 'games');
      const docRef = doc(coll, gameId);
      this.games$ = docData(docRef);
      // holen hier nur die Daten des Dokuments mit der passenden ID
      this.games$.subscribe((newgamedata) => {
        console.log('Game update:', newgamedata);
        this.game.currentPlayer = newgamedata.currentPlayer;
        this.game.playedCard = newgamedata.playedCard;
        this.game.players = newgamedata.players;
        this.game.stack = newgamedata.stack;
      });
    });
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      // pop gibt uns den letzten Wert des Arrays aus und entfernt ihn aus Array
      this.pickCardAnimation = true;

      setTimeout(() => {
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        // zählt nicht höher als die länge unseres spieler arrays, moduluoperator
      }, 1500)


      setTimeout(() => {
        this.game.playedCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
    // const coll = collection(this.firestore, 'games');
    // addDoc(coll, this.game.toJson());
    // setDoc(doc(coll), this.game.toJson());
    // funktioniert beides, welches besser? add macht mehr sinn, setDoc im Vorkurs gelernt
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
    // hier wird bestimmt, was nach dem schließen mit dem Wert des Inputfeldes passiert
    // pushen den Namen in unser Array
  }
}
