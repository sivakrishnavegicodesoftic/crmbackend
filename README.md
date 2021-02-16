# crmbackend


#routes

/ homepage routes

#userRoutes 
http://localhost:8002/api/customer
#adminRoutes
http://localhost:8002/api/admin

#userEndpoints
 
  login :                                    http://localhost:8002/api/customer/login';
  getallUsersList type('customer') :         http://localhost:8002/api/customer/getUsersList;
  forgetPassword:                            http://localhost:8002/api/customer/forgetPassword;
  verifyOtp :                                http://localhost:8002/api/customer/verifyOtp;

#AdminRoutes

//for getting all users list
getting all Admins List :   'http://localhost:8002/api/admin/getAdminsList';

//for creating a new user
creating a NewUser :   http://localhost:8002/api/admin/createUser;
adminLogin:            http://localhost:8002/api/admin/login;



 
