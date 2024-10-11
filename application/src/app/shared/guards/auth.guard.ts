import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Util } from '../util';
import { ToastrService } from 'ngx-toastr';

export const authGuard: CanActivateFn = async (
  route,
  state
): Promise<boolean | UrlTree> => {
  const router = inject(Router);
  const util = inject(Util);
  const toastr = inject(ToastrService);
  //console.log(util.isAuth());
  if (!util.isAuth()) {
    toastr.warning('User not logged in', '');
    return router.createUrlTree(['/login']);
  }

  return true;
};
