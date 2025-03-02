import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Coachmark from '../Coachmark';
import setOnboardingWizardStep from '../../../../actions/wizard';
import { strings } from '../../../../../locales/i18n';
import onboardingStyles from './../styles';
import {
  MetaMetricsEvents,
  ONBOARDING_WIZARD_STEP_DESCRIPTION,
} from '../../../../core/Analytics';
import { useTheme } from '../../../../util/theme';
import { OnboardingWizardModalSelectorsIDs } from '../../../../../e2e/selectors/Modals/OnboardingWizardModal.selectors';
import { useMetrics } from '../../../../components/hooks/useMetrics';

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  coachmarkContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  coachmark: { marginHorizontal: 16 },
});

const Step4 = (props) => {
  const { setOnboardingWizardStep, onClose } = props;
  const { trackEvent } = useMetrics();
  const { colors } = useTheme();
  const dynamicOnboardingStyles = onboardingStyles(colors);
  const [coachmarkBottom, setCoachmarkBottom] = useState();

  const getCoachmarkPosition = useCallback(() => {
    props?.coachmarkRef?.current?.measure(
      (x, y, width, heigh, pageX, pageY) => {
        setCoachmarkBottom(Dimensions.get('window').height - pageY);
      },
    );
  }, [props?.coachmarkRef]);

  useEffect(() => {
    getCoachmarkPosition();
  }, [getCoachmarkPosition]);

  /**
   * Dispatches 'setOnboardingWizardStep' with next step
   */
  const onNext = () => {
    setOnboardingWizardStep && setOnboardingWizardStep(5);
    trackEvent(MetaMetricsEvents.ONBOARDING_TOUR_STEP_COMPLETED, {
      tutorial_step_count: 4,
      tutorial_step_name: ONBOARDING_WIZARD_STEP_DESCRIPTION[4],
    });
  };

  /**
   * Dispatches 'setOnboardingWizardStep' with back step
   */
  const onBack = () => {
    setOnboardingWizardStep && setOnboardingWizardStep(3);
    trackEvent(MetaMetricsEvents.ONBOARDING_TOUR_STEP_REVISITED, {
      tutorial_step_count: 4,
      tutorial_step_name: ONBOARDING_WIZARD_STEP_DESCRIPTION[4],
    });
  };

  /**
   * Calls props 'onClose'
   */
  const handleOnClose = () => {
    onClose && onClose(false);
  };

  /**
   * Returns content for this step
   */
  const content = () => (
    <View style={dynamicOnboardingStyles.contentContainer}>
      <Text
        style={dynamicOnboardingStyles.content}
        testID={OnboardingWizardModalSelectorsIDs.STEP_FOUR_CONTAINER}
      >
        {strings('onboarding_wizard_new.step4.content1')}
      </Text>
    </View>
  );

  return (
    <View style={styles.main}>
      <View
        style={[
          styles.coachmarkContainer,
          {
            bottom: coachmarkBottom,
          },
        ]}
      >
        <Coachmark
          title={strings('onboarding_wizard_new.step4.title')}
          content={content()}
          onNext={onNext}
          onBack={onBack}
          style={styles.coachmark}
          bottomIndicatorPosition={'bottomCenter'}
          currentStep={3}
          onClose={handleOnClose}
        />
      </View>
    </View>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOnboardingWizardStep: (step) => dispatch(setOnboardingWizardStep(step)),
});

Step4.propTypes = {
  /**
   * Dispatch set onboarding wizard step
   */
  setOnboardingWizardStep: PropTypes.func,
  /**
   * Callback called when closing step
   */
  onClose: PropTypes.func,
  /**
   *  coachmark ref to get position
   */
  coachmarkRef: PropTypes.object,
};

export default connect(null, mapDispatchToProps)(Step4);
