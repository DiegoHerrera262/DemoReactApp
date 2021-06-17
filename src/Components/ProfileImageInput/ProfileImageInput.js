import React from 'react';
import profileImageInputStyles from './ProfileImageInput.module.css';

const ProfileImageInput = (props) => {
    const inputID = 'profileImage';
    const {formHook, src, labelKey, parentRef} = props;
    const formButtonStyle = props.edit ? profileImageInputStyles['edit-button-edit'] : profileImageInputStyles['edit-button'];
    const imageStyle = props.edit ? profileImageInputStyles['profile-photo-edit'] : profileImageInputStyles['profile-photo'];
    return (
        <div
            className={profileImageInputStyles['profile-image-card']}
        >
            <div
                className={profileImageInputStyles['image-container']}
            >
                <img
                    src={src} 
                    alt={labelKey}
                    className={imageStyle}
                />
            </div>
            <div
                className={profileImageInputStyles['info-container']}
            >
                <div className={profileImageInputStyles['profile-image-label']}>
                    {labelKey}
                </div>
                <label
                    htmlFor={inputID}
                    className={formButtonStyle}
                >
                    Cargue foto
                </label>
                <input 
                    id={inputID}
                    name={inputID}
                    type='file'
                    placeholder='Ingrese foto de perfil'
                    accept='image/*'
                    ref={parentRef}
                    onChange={(event) => {
                        formHook.setFieldValue(
                            'profileImage',
                            event.currentTarget.files[0]
                        )
                    }}
                />
            </div>
        </div>
    );
}

export default ProfileImageInput;