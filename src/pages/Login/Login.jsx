import React, { useEffect, useState } from "react";
import { useQueryParams, useSetQueryParams } from "../../hook";
import * as api from '../../api/api';
import { toast } from 'react-toastify';
import { CustomToastId, LocalStorageKey } from "../../utils/constant";
import jwt from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import './Login.scss';

const Login = () => {
    const [inputs, setInputs] = useState({});
    const [submit, setSubmit] = useState(false)

    const queryParams = useQueryParams()
    const setQueryParams = useSetQueryParams()
    const navigate = useNavigate()

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = () => {
        if (!inputs.username || !inputs.password) {
            if (toast.isActive(CustomToastId.LoginForm)) {
                toast.update(CustomToastId.LoginForm, { render: "Tên đăng nhập và mật khẩu không được để trống", type: 'warning', isLoading: false })
            } else {
                toast.warning("Tên đăng nhập và mật khẩu không được để trống", { toastId: CustomToastId.LoginForm })
            }

            setSubmit(false)
        } else {
            setSubmit(true)
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSubmit()
        }
    }

    useEffect(() => {
        if (submit) {
            const fetchData = async () => {
                if (toast.isActive(CustomToastId.LoginForm)) {
                    toast.update(CustomToastId.LoginForm, { render: "Đang xử lý ...", isLoading: true })
                } else {
                    toast.loading("Đang xử lý ...", { toastId: CustomToastId.LoginForm })
                }

                try {
                    const resultApi = await api.login(inputs)
                    if (resultApi && resultApi.data) {
                        if (resultApi.data.code != 0) {
                            toast.update(CustomToastId.LoginForm, { render: resultApi.data.message, type: "error", isLoading: false, autoClose: 3000 })
                        } else {
                            toast.update(CustomToastId.LoginForm, { render: "Đăng nhập thành công", type: "success", isLoading: false, autoClose: 3000 })
                            const accessToken = resultApi.data.data.accessToken
                            const decodedToken = jwt(accessToken)
                            localStorage.setItem(LocalStorageKey.User_Id, decodedToken?.userId)
                            localStorage.setItem(LocalStorageKey.User_Role, decodedToken?.userRole)
                            localStorage.setItem(LocalStorageKey.User_Name, decodedToken?.userName)
                            const farmIds = decodedToken?.farmIds?.split(',') || []
                            if (farmIds.length === 1) {
                                localStorage.setItem(LocalStorageKey.Farm_Ids, decodedToken?.farmIds)
                                localStorage.setItem(LocalStorageKey.Farm_Id_Selected, farmIds[0])
                                setQueryParams('/farm', {
                                    ...queryParams,
                                    farm_id: farmIds[0]
                                })
                            } else if (farmIds.length > 1) {
                                localStorage.setItem(LocalStorageKey.Farm_Ids, decodedToken?.farmIds)
                                navigate('/farm-list')
                            } else {
                                toast.update(CustomToastId.LoginForm, { render: "Đăng nhập thất bại", type: "error", isLoading: false, autoClose: 3000 })
                            }
                        }
                    } else {
                        toast.update(CustomToastId.LoginForm, { render: "Đăng nhập thất bại", type: "error", isLoading: false, autoClose: 3000 })
                    }
                } catch (e) {
                    toast.update(CustomToastId.LoginForm, { render: "Đăng nhập thất bại", type: "error", isLoading: false, autoClose: 3000 })
                }
                setSubmit(false)
            }

            fetchData()
        }
    }, [submit])

    return (
        <div>
            <div className="login-main">
                <div className="row login-custom-row">
                    <div className="col-md-6 login-side-image"></div>
                    <div className="col-md-6 login-right">
                        <div className="login-input-box">
                            <header>Đăng nhập vào hệ thống</header>
                            <div className="input-field">
                                <input 
                                    type="text" 
                                    className="input" 
                                    required={true}
                                    autoComplete="off" 
                                    placeholder="Tên đăng nhập"
                                    name="username"
                                    value={inputs.username}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="input-field">
                                <input 
                                    type="password" 
                                    className="input" 
                                    required={true}
                                    placeholder="Mật khẩu"
                                    name="password"
                                    value={inputs.password}
                                    onChange={handleChange}
                                    onKeyDown={handleKeyDown}
                                />
                            </div>
                            <div className="input-field">
                                <input 
                                    type="submit" 
                                    value="Đăng nhập" 
                                    className="submit" 
                                    onClick={handleSubmit}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;