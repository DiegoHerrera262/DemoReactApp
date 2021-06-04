import React from 'react';
import profileImageInputStyles from './ProfileImageInput.module.css';

const ProfileImageInput = (props) => {
    const {formHook, src, labelKey, parentRef} = props;
    return (
        <div>
            <div 
                id='profileImage' 
                className={profileImageInputStyles['profile-image-card']}
            >
                <label
                    className={profileImageInputStyles['profile-image-label']}
                    htmlFor='profileImage'
                >
                    {labelKey}
                </label> 
                <p align='center'>
                    <img
                        className={profileImageInputStyles['profile-image']}
                        src={src} 
                        alt={labelKey} 
                    />
                </p>
            </div>
            <div className={profileImageInputStyles['input-field']}>
                <input 
                    id='profileImage'
                    name='profileImage'
                    type='file'
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