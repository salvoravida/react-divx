/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';

const fullAreaStyle = {
  height: '100%',
  width: '100%'
};

class DivX extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.clientHeight = 0;
    this.clientWidth = 0;
    this.dynamics = {};
  }

    componentDidMount = () => {
      if (this.props.onOuterClick || this.props.onDocumentClick) document.addEventListener('click', this.onDocumentClick);
      if (this.props.onEscPress || this.props.onDocumentKeydown) document.addEventListener('keydown', this.onDocumentKeydown);
      if (this.props.onResize) this.onResize();

      // dynamics handlers attach
      Object.keys(this.getDynamicProps()).forEach((dynamicProp) => {
        const key = dynamicProp.toLowerCase();
        if (dynamicProp.indexOf('onWindow') === 0 && key.replace('onwindow', '').length > 0) {
          window.addEventListener(key.replace('onwindow', ''), this.createDynamicHandler(dynamicProp));
        }
        if (dynamicProp.indexOf('onDocument') === 0 && key.replace('ondocument', '').length > 0) {
          document.addEventListener(key.replace('ondocument', ''), this.createDynamicHandler(dynamicProp));
        }
      });
    };

    componentDidUpdate = () => {
      if (this.props.onResize) this.onResize();
    };

    componentWillUnmount = () => {
      if (this.props.onOuterClick || this.props.onDocumentClick) document.removeEventListener('click', this.onDocumentClick);
      if (this.props.onEscPress || this.props.onDocumentKeydown) document.removeEventListener('keydown', this.onDocumentKeydown);

      // dynamics handlers remove
      Object.keys(this.dynamics).forEach((dynamicProp) => {
        const key = dynamicProp.toLowerCase();
        if (dynamicProp.indexOf('onWindow') === 0 && key.replace('onwindow', '').length > 0) {
          window.removeEventListener(key.replace('onwindow', ''), this.dynamics[dynamicProp]);
        }
        if (dynamicProp.indexOf('onDocument') === 0 && key.replace('ondocument', '').length > 0) {
          document.removeEventListener(key.replace('ondocument', ''), this.dynamics[dynamicProp]);
        }
      });
    };

    onDocumentKeydown = (event) => {
      if (event.keyCode === 27) {
        if (typeof this.props.onEscPress === 'function') this.props.onEscPress(event);
      }
      if (typeof this.props.onDocumentKeydown === 'function') this.props.onDocumentKeydown(event);
    };

    onResize = () => {
      if (this.container) {
        const { clientHeight, clientWidth } = this.container;
        if (clientWidth !== this.clientWidth || clientHeight !== this.clientHeight) {
          this.clientHeight = clientHeight;
          this.clientWidth = clientWidth;
          if (typeof this.props.onResize === 'function') this.props.onResize(clientWidth, clientHeight);
        }
      }
    };

    onDocumentClick = (e) => {
      if (this.container && !this.container.contains(e.target)) {
        if (typeof this.props.onOuterClick === 'function') this.props.onOuterClick(e);
      }
      if (typeof this.props.onDocumentClick === 'function') this.props.onDocumentClick(e);
    };

    getDynamicProps = () => {
      // eslint-disable-next-line
        const { innerRef, onOuterClick, onResize, onEscPress, onDocumentKeydown, onDocumentClick, ...rest } = this.props;
      return rest;
    };

    getRealDivProps = () => {
      const rest = this.getDynamicProps();
      Object.keys(rest).forEach((dynamicProp) => {
        const key = dynamicProp.toLowerCase();
        if (key.indexOf('onwindow') === 0 || key.indexOf('ondocument') === 0) {
          delete rest[dynamicProp];
        }
      });
      return rest;
    };

    setRef = (ref) => {
      this.container = ref;
      if (this.props.innerRef) {
        this.props.innerRef(ref);
      }
    };

    createDynamicHandler = (dynamicProp) => {
      this.dynamics[dynamicProp] = (...args) => {
        if (this.props[dynamicProp]) this.props[dynamicProp](...args);
      };
      return this.dynamics[dynamicProp];
    };

    render() {
      const {
        fullArea, children, onOuterClick, onResize
      } = this.props;
      const realDivProps = this.getRealDivProps();
      const needRealDiv = onOuterClick || onResize || Object.keys(realDivProps).length > 0;

      return needRealDiv ? (
        <div ref={this.setRef} {...realDivProps} style={fullArea ? fullAreaStyle : undefined}>
          {children}
        </div>
      ) : children;
    }
}

DivX.propTypes = {
  innerRef: PropTypes.func,
  onOuterClick: PropTypes.func,
  onEscPress: PropTypes.func,
  onResize: PropTypes.func,
  onDocumentKeydown: PropTypes.func,
  onDocumentClick: PropTypes.func,
  children: PropTypes.any.isRequired,
  fullArea: PropTypes.bool
};

export default DivX;
