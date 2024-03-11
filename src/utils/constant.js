export const ValueStandard = {
    Good: 'Good',
    Medium: 'Medium',
    Bad: 'Bad',
    NoStatus: 'No Status'
}

export const PropertyStandard = {
    Temp: 'temp',
    WinSpeed: 'winSpeed',
    Humi: 'humi',
    Co2: 'co2'
}

export const CustomToastId = {
    AddUserForm: 'add-user-form-id',
    LoginForm: 'login-form-id',
    InformationTab: 'information-tab',
    UpdateInformation: 'update-information',
    ChangePasswordTab: 'change-password-tab',
    AddminUserTable: 'admin-user-table',
    LoginRequire: 'login-require',
    DeleteUsers: 'delete-users',
    ResetPasswordTab: 'reset-password-tab',
    AddHouseForm: 'add-house-form-id',
    EditHouseForm: 'edit-house-form-id',
    DeleteFarm: 'delete-farm-form-id',
    SaveReport: 'save-report-id',
    ReviewReport: 'review-report-id'
}

export const LocalStorageKey = {
    User_Id: 'iot_farm_user_id',
    User_Role: 'iot_farm_user_role',
    User_Name: 'iot_farm_user_name',
    Full_Name: 'iot_farm_full_name',
    Farm_Ids: 'iot_farm_farm_ids',
    Farm_Id_Selected: 'iot_farm_id_selected',
    Open_Sub_Menu_Keys: 'iot_farm_open_sub_menu_keys',
    Current_Active_Houses: 'iot_farm_current_active_houses'
}

export const RoleId = {
    Manager: 1,
    Admin: 2,
    Staff: 3,
    IT: 4
}

export const roles = {
    1: 'Manager',
    2: 'Admin',
    3: 'Staff',
    4: 'IT'
}

export const listRoles = [
    {roleId: RoleId.IT, roleName: roles[RoleId.IT]},
    {roleId: RoleId.Manager, roleName: roles[RoleId.Manager]},
    {roleId: RoleId.Admin, roleName: roles[RoleId.Admin]},
    {roleId: RoleId.Staff, roleName: roles[RoleId.Staff]},
]

export const FarmId = {
    All: 0,
    ThuyXuanTien: 1,
    YenThuy: 2,
    BaoHieu: 3
}

export const farms = {
    0: 'All',
    1: 'ThuyXuanTien',
    2: 'YenThuy',
    3: 'BaoHieu'
}

export const farmNames = {
    All: 'Tất cả Farm',
    ThuyXuanTien: 'Thủy Xuân Tiên',
    YenThuy: 'Yên Thủy',
    BaoHieu: 'Bảo Hiệu'
}

export const listFarms = [
    { farmId: FarmId.All, farmName: farmNames[farms[FarmId.All]] },
    { farmId: FarmId.ThuyXuanTien, farmName: farmNames[farms[FarmId.ThuyXuanTien]] },
    { farmId: FarmId.YenThuy, farmName: farmNames[farms[FarmId.YenThuy]] },
    { farmId: FarmId.BaoHieu, farmName: farmNames[farms[FarmId.BaoHieu]] },
]

export const listFarms2 = [
    { farmId: FarmId.ThuyXuanTien, farmName: farmNames[farms[FarmId.ThuyXuanTien]] },
    { farmId: FarmId.YenThuy, farmName: farmNames[farms[FarmId.YenThuy]] },
    { farmId: FarmId.BaoHieu, farmName: farmNames[farms[FarmId.BaoHieu]] },
]

export const reportStatus = {
    Pending: 'Pending',
    Approve: 'Approve',
    Reject: 'Reject'
}