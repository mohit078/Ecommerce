import { Component, OnInit } from '@angular/core';
import { Global } from '../../global';
import { Menu, NavService } from '../../services/nav.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  menuItems: Menu[];
  fullName: string;
  userType: string;
  imagePath = 'assets/images/user.png';

  constructor( public _NavService: NavService ) { 
    this.menuItems = _NavService.MENUITEMS;
  }

  ngOnInit(): void {
    let userDetails = JSON.parse(localStorage.getItem("userDetails"));
    this.fullName = `${userDetails.firstName} ${userDetails.lastName}`;
    this.userType = userDetails.userType;
    // this.imagePath = Global.BASE_IMAGES_PATH + userDetails.imagePath;
}

  toggleNavActive(menuItem){
    menuItem.active = !menuItem.active;
  }

}
