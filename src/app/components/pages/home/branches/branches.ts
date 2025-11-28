import { Component, inject, signal } from '@angular/core';
import { HomeServ } from '../../../../services/home-serv';
import { Category } from '../../../../types/Homets';
import { BranchServ } from '../../../../services/branch-serv';
import { BranchesTs } from '../../../../types/branches';

@Component({
  selector: 'app-branches',
  imports: [],
  templateUrl: './branches.html',
  styleUrl: './branches.css',
})
export class Branches {
  homeServ = inject(HomeServ);
  branchServ = inject(BranchServ);
  brances = signal<BranchesTs[]>([]);
  categories = signal<Category[]>([]);
  getCategories = this.homeServ.getHomeData().subscribe((res) => {
    let category = res.categories;
    this.categories.set(category);
  });
  getBranches = this.branchServ.getBranches().subscribe((res) => {
    this.brances.set(res);
  });
}
