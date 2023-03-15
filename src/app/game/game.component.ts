import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { collection, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';

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
  games: Array<any>;

  constructor(firestore: Firestore, public dialog: MatDialog) { 
    const coll = collection(firestore, 'games');
    this.games$ = collectionData(coll);
    this.games$.subscribe((newgamedata) => {
      console.log('Game update:', newgamedata);
      this.games = newgamedata;
    })
  }

  ngOnInit(): void {
    this.newGame();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop();
      // pop gibt uns den letzten Wert des Arrays aus und entfernt ihn aus Array
      this.pickCardAnimation = true;

      setTimeout (() => {
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
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe(name => {
      if(name && name.length > 0) {
        this.game.players.push(name);
      }
    });
    // hier wird bestimmt, was nach dem schließen mit dem Wert des Inputfeldes passiert
    // pushen den Namen in unser Array
  }
}
