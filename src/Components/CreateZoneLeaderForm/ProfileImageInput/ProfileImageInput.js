import React from 'react';
import profileImageInputStyles from './ProfileImageInput.module.css';

const ProfileImageInput = (props) => {
    const inputID = 'profileImage';
    const {formHook, src, labelKey, parentRef} = props;
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
                    className={profileImageInputStyles['profile-photo']}
                />
            </div>
            <div
                className={profileImageInputStyles['info-container']}
            >
                <div className={profileImageInputStyles['profile-image-label']}>
                    <label>
                        {labelKey}
                    </label>
                </div>
                <label
                    htmlFor={inputID}
                    className={profileImageInputStyles['edit-button']}
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