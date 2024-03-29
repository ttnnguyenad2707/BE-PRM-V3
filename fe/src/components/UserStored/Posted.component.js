import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import './Posted.scss'
import images from '../../assets/images';
import { Modal, Tabs } from 'antd';
import { Space, Table } from "antd"
import {
    
    LoadingOutlined,
   
  } from '@ant-design/icons';

import TabPane from 'antd/es/tabs/TabPane';
import Column from 'antd/es/table/Column';
import { deletePost, destroyPost, getPostedStore, restorePost } from '../../services/post.service';
import ColumnGroup from 'antd/es/table/ColumnGroup';
import { useNavigate, useOutletContext } from 'react-router-dom';
const Posted = () => {
    const [isLoading, setIsLoading] = useState(true);
const [user]  = useOutletContext();
    useEffect(() => {
        if (user) {
            setIsLoading(false);
        }
        }, [user]);


    console.log(user);
    const [activeTab, setActiveTab] = useState('1');
    const [dataPosted, setDataPosted] = useState([]);
    const [dataDeleted, setDataDeleted] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [postId, setPostId] = useState('');
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    useEffect(() => {
        if (activeTab === "1") {
            getPostedStore("posted").then(data => { setDataPosted(data.data) });
        }
        else if (activeTab === "2") {
            getPostedStore("deleted").then(data => { setDataDeleted(data.data) });
        }

    }, [activeTab])


    const handleDelete = (id) => {
        const result = window.confirm("Delete");
        if (result === true) {
            deletePost(id).then(() => {
                // Sau khi xóa thành công, cập nhật lại state dataPosted
                setDataPosted(prevData => prevData.filter(post => post._id !== id));
            });
        }

    }

    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`${id}`);

    }

    const handleRestore = (id) => {
        restorePost(id).then(() => {
            // Sau khi khôi phục thành công, cập nhật lại state dataPosted
            setDataDeleted(prevData => prevData.filter(post => post._id !== id));
        });;

    }

    const handleDestroy = (id) => {
        if (window.confirm("Bạn thật sự muốn loại bỏ bài viết này ?")) {


            destroyPost(id).then(() => {
                // Sau khi xóa vĩnh viễn thành công, cập nhật lại state dataPosted
                setDataDeleted(prevData => prevData.filter(post => post._id !== id));
            });;
        }

    }

    return (
        <div>
            {isLoading ? (<div className='text-center'>
            <LoadingOutlined />
            </div>
            )
                : (<div className='component-usePosted bg-F4F4F4 '>
                    <div className='container'>
                        <div className='content '>
                            <div className='component-title'>Quản lý tin của bạn</div>
                            <div className='profile-user d-flex justify-content-between border-1 border'>

                                <div className='user-box d-flex align-items-center gap-3'>
                                    <div className='avatar' >
                                        <img src={images.avatarDefault} alt='avatar' height="80px" />
                                    </div>
                                    <div className='user-link d-flex flex-column gap-2'>
                                        <div className='username'>{user.firstname}</div>
                                        <div className='list-button d-flex gap-2'>
                                            <button className='btn btn-outline-danger'>Trang cá nhân</button>
                                            <button className='btn btn-outline-danger'>Đăng bài viết mới </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='more-info d-flex flex-column gap-3'>
                                    <div className='btn-bg-primary text-white p-2 rounded'>Loại tài khoản: <strong>VIP</strong></div>
                                    <div className='btn-bg-primary text-white p-2 rounded'>Số lượng bài đăng: <strong>1 / 100</strong></div>

                                </div>

                            </div>
                            {/* <Tabs defaultActiveKey="1" items={items} />  */}
                            <Tabs activeKey={activeTab} onChange={handleTabChange} >
                                <TabPane tab="Bài viết đã đăng" key="1">
                                    <Table dataSource={dataPosted}>
                                        <ColumnGroup>
                                            <Column
                                                title="Số thứ tự"
                                                dataIndex="_index"
                                                key="_index"
                                                render={(_, __, index) => index + 1}
                                            />
                                            <Column title="Tiêu đề" dataIndex="title" key="title" />
                                            <Column title="Địa chỉ" dataIndex="address" key="address" />
                                            <Column title="Giá thuê" dataIndex="price" key="price" />
                                            <Column title="Số người" dataIndex="maxPeople" key="maxPeople" />
                                            <Column title="Action" key="action" render={(_, record) => (
                                                <Space size="middle">
                                                    <a className="btn btn-outline-info" onClick={() => handleEdit(record._id)}>Edit</a>
                                                    <a className="btn btn-outline-danger" onClick={() => handleDelete(record._id)}>Delete</a>
                                                </Space>
                                            )} />
                                        </ColumnGroup>

                                    </Table>
                                </TabPane>
                                <TabPane tab="Bài Viết đã xóa" key="2">
                                    <Table dataSource={dataDeleted}>
                                        <ColumnGroup>
                                            <Column
                                                title="Số thứ tự"
                                                dataIndex="_index"
                                                key="_index"
                                                render={(_, __, index) => index + 1}
                                            />
                                            <Column title="Tiêu đề" dataIndex="title" key="title" />
                                            <Column title="Địa chỉ" dataIndex="address" key="address" />
                                            <Column title="Giá thuê" dataIndex="price" key="price" />
                                            <Column title="Số người" dataIndex="maxPeople" key="maxPeople" />

                                            <Column title="Action" key="action" render={(_, record) => (
                                                <Space size="middle">
                                                    <a className="btn btn-outline-info" onClick={() => handleRestore(record._id)}>Restore</a>
                                                    <a className="btn btn-outline-danger" onClick={() => handleDestroy(record._id)}>Destroy</a>
                                                </Space>
                                            )} />



                                        </ColumnGroup>


                                    </Table>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>

                </div>)}
        </div>


    )
}

export default Posted