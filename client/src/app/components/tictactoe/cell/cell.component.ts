import { Component, Input, OnInit } from '@angular/core';
import { PlayerIdentifier } from '../../../lib/shared/enums/PlayerIdentifier';

@Component({
    selector: 'tictactoe-cell',
    templateUrl: './cell.component.html',
    styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

    @Input() public piece: PlayerIdentifier = PlayerIdentifier.EMPTY;
    @Input() public row!: number;
    @Input() public col!: number;

    constructor() { }

    ngOnInit(): void {
    }

}