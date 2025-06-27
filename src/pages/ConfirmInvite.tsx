import { Result } from 'antd';
import React, { useEffect } from 'react';
import { StorageKeys } from '../common/StorageKeys';
import Footer from '../components/Footer/footer';
import { Header } from '../components/Header/Header';
import { useUserInfo } from '../hooks/useUserInfo';
import organizationsAPI from '../services/organizationsAPI';

const ConfirmInvite = () => {
    useUserInfo({
        redirectAfterLogin: window.location.href,
    });

    if (!localStorage.getItem(StorageKeys.AUTH_TOKEN)) {
        window.location.href = '/login';
    }

    // Get query parameters from the URL
    const params = new URLSearchParams(window.location.search);
    const invitationId = params.get('invitationId');

    const [confirmationResult, setConfirmationResult] = React.useState(<></>);

    useEffect(() => {
        const confirmInvite = async () => {
            if (!invitationId) {
                setConfirmationResult(
                    <div className="homePage">
                        <Header />
                        <Result
                            status="warning"
                            title="Invitation ID is missing"
                            subTitle="Please check the link you received."
                            extra={<a href="/">Go to Home</a>}
                        />
                        <Footer />
                    </div>
                );
                return;
            }

            const result = await organizationsAPI.confirmInvite(invitationId || '');
            if (!!result) {
                setConfirmationResult(
                    <div className="homePage">
                        <Header />
                        <Result
                            status="success"
                            title="Invitation Confirmed"
                            subTitle="You have successfully accepted the invitation."
                            extra={<a href="/">Go to Home</a>}
                        />
                        <Footer />
                    </div>
                );
            } else {
                setConfirmationResult(
                    <div className="homePage">
                        <Header />
                        <Result
                            status="error"
                            title="Invitation Confirmation Failed"
                            subTitle="There was an error confirming your invitation. Please try again later."
                            extra={<a href="/">Go to Home</a>}
                        />
                        <Footer />
                    </div>
                );
            }
        };

        confirmInvite();
    }, [invitationId]);

    return confirmationResult;
};

export default ConfirmInvite;