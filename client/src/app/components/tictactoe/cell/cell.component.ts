import { Component, Input, OnInit } from '@angular/core';
import { CellEnum } from '../../../lib/shared/enums/CellEnum';

@Component({
    selector: 'tictactoe-cell',
    templateUrl: './cell.component.html',
    styleUrls: ['./cell.component.scss']
})
export class CellComponent implements OnInit {

    @Input() public piece: CellEnum = CellEnum.EMPTY;
    @Input() public row!: number;
    @Input() public col!: number;

    constructor() { }

    ngOnInit(): void {
    }

}