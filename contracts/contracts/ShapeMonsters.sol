// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/*


                       _______           _______  _______  _______    _______  _______  _        _______ _________ _______  _______  _______
                      (  ____ \|\     /|(  ___  )(  ____ )(  ____ \  (       )(  ___  )( (    /|(  ____ \\__   __/(  ____ \(  ____ )(  ____ \
                      | (    \/| )   ( || (   ) || (    )|| (    \/  | () () || (   ) ||  \  ( || (    \/   ) (   | (    \/| (    )|| (    \/
                      | (_____ | (___) || (___) || (____)|| (__      | || || || |   | ||   \ | || (_____    | |   | (__    | (____)|| (_____
                      (_____  )|  ___  ||  ___  ||  _____)|  __)     | |(_)| || |   | || (\ \) |(_____  )   | |   |  __)   |     __)(_____  )
                            ) || (   ) || (   ) || (      | (        | |   | || |   | || | \   |      ) |   | |   | (      | (\ (         ) |
                      /\____) || )   ( || )   ( || )      | (____/\  | )   ( || (___) || )  \  |/\____) |   | |   | (____/\| ) \ \__/\____) |
                      \_______)|/     \||/     \||/       (_______/  |/     \|(_______)|/    )_)\_______)   )_(   (_______/|/   \__/\_______)







                                                            @@@@@@@@@@@@@@@@@@@&#//*,,,... ....
                                                          @@@,......./@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
                            @@@@,                        @@@.....,,,,,,,,,,,,,,,,,,,,,,,,,,,,....(@@@@
                          @@@@@@@@@                     @@@...,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,..@@@@
                          @@@@@@@@@@                   @@@(.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.@@@                               @@@@@@
                           @@@@@@@.                    @@@.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.#@@(                            @@@@@@@@@
                            ,/@@@                     @@@,.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.@@@                            @@@@@@@@@&
                              @&                      @@@.,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.@@@                             @@@@@@@
                              @#                     #@@#,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,.@@@                             @@@
                              @&                     @@@,,,,,,,,,,,,,,@@@@,,,,,,,,,,,,,,@@,,,,,,,,,,,,@@@                           (@(
                              @@                     @@@,,,,,,,,,,,,%@@@@@@,,,,,,,,,,,@@@@@@,,,,,,,,,,.@@@                         @@
                              @@                    @@@(,,,,,,,,,,,,@@@@@@@@,,,,,,,,,@@@@@@@@,,,,,,,,,,@@@                       @@@
                               @@                   @@@,,,,,,,,,,,,/@@@@@@@@,,,,,,,,,@@@@@@@@,,,,,,,,,,,@@@                    @@@
                               .@#                 #@@@,,,,,,,,,,,,,@@@@@@@@,,,,,,,,,@@@@@@@@,,,,,,,,,,,@@@                 @@@
                                 @@                @@@,,,,,,,,,,,,,,@@@@@@@@,,,,,,,,,@@@@@@@@,,,,,,,,,,,*@@@            @@@@
                                  &@@              @@@,,,,,,,,,,,,,,@@@@@@@@,,,,,,,,,@@@@@@@@,,,,,,,,,,,,@@@      @@@@@@
                                     @@@@         @@@(,,,,,,,,,,,,,,,@@@@@&,,,,,,,,,,,@@@@@@,,,,,,,,,,,%/#@@@@@@@@@
                                         @@@@@@@& @@@@@@%,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@@@@@
                                                 (@@@@@@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,*@@,,@@&
                                                 @@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@
                                                 @@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@@/,,,,,,,,,,,,,,,@@@
                                                %@@,,,,,,,,,,,,@@@@@@@@,,,,,,,,,,,(@@@@@@@@@@@@@,,,,,,,,,,,,@@@
                                                @@@,,,,,,,,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,,,,,,,,,,,@@&
                                                @@%,,,,,,,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,,,,,,,,,,,@@@
                                               &@@,,,,,,,,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,,,,,,,,,,,*@@%
                                               @@@,,,,,,,,,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,,,,,,,,,,,,,@@@
                                               @@#,,,,,,,,,,,@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,,,,,,,,,,,,,,@@@
                                              @@@,,,,,,,,,,,,,@@@@@@@@@@@#,,,@@@@@@@@@@@@@@@@,,,,,,,,,,,,,,,,,&@@@
                                              @@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,@@@@@@/,,,,,,,,,,,,,,,,,,,,,@@@
                                             .@@/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,&@@@
                                             @@@,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,*@@@#
                                              @@@@/,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,*@@@@@@&
                                                @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&
                                                           @@@                                      @@@
                                                           @@@                                      @@@
                                                           @@@                                      @@@
                                                           @@%                                      @@@
                                                           @@@                                       @@@
                                                           @@@                                       @@@
                                                           @@@,                                      @@@
                                             @@@@@@@@@@@@@@@@@@                                      @@@@@@@@@@@@@@@@@@
                                            @@@@@@@@@@@@@@@@@@@                                     @@@@@@@@@@@@@@@@@@@


 */

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import { IERC2981, IERC165 } from "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract ShapeMonsters is ERC721, IERC2981, Ownable, ReentrancyGuard, ERC721Enumerable {
  using Strings for uint256;

  string public PROVENANCE_HASH;

  uint256 constant MAX_SUPPLY = 2222;
  uint256 private _currentId;

  string public baseURI;
  string private _contractURI;

  bool public isWhitelistActive = false;
  bool public isFreemintActive = false;
  bool public isMintActive = false;

  mapping(address => bool) private _alreadyMinted;
  mapping(address => bool) private _alreadyWhitelistMinted;

  uint256 public whitelistPrice = 5 ether;
  uint256 public price = 8 ether;

  bytes32 public merkleRootWhitelist;
  bytes32 public merkleRootFreemint;

  address public beneficiary;
  address public royalties;

  constructor(
    address _beneficiary,
    address _royalties,
    string memory _initialBaseURI,
    string memory _initialContractURI
  ) ERC721("Shape Monsters", "ShapeMonsters") {
    beneficiary = _beneficiary;
    royalties = _royalties;
    baseURI = _initialBaseURI;
    _contractURI = _initialContractURI;
  }

  // Accessors

  function setProvenanceHash(string calldata hash) public onlyOwner {
    PROVENANCE_HASH = hash;
  }

  function setBeneficiary(address _beneficiary) public onlyOwner {
    beneficiary = _beneficiary;
  }

  function setRoyalties(address _royalties) public onlyOwner {
    royalties = _royalties;
  }

  function setWhitelistActive(bool _isActive) public onlyOwner {
    isWhitelistActive = _isActive;
  }

  function setFreemintActive(bool _isActive) public onlyOwner {
    isFreemintActive = _isActive;
  }

  function setMintActive(bool _isActive) public onlyOwner {
    isMintActive = _isActive;
  }

  function setMerkleRootWhitelist(bytes32 _merkleRoot) public onlyOwner {
    merkleRootWhitelist = _merkleRoot;
  }

  function setMerkleRootFreemint(bytes32 _merkleRoot) public onlyOwner {
    merkleRootFreemint = _merkleRoot;
  }

  function alreadyMinted(address addr) public view returns (bool) {
    return _alreadyMinted[addr];
  }

  function totalSupply() public view override(ERC721Enumerable) returns (uint256) {
    return _currentId;
  }

  // Metadata

  function setBaseURI(string memory uri) public onlyOwner {
    baseURI = uri;
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  function contractURI() public view returns (string memory) {
    return _contractURI;
  }

  function setContractURI(string memory uri) public onlyOwner {
    _contractURI = uri;
  }

  // Minting

  function mintListed(
    uint256 amount,
    bytes32[] calldata merkleProof
    ) public payable nonReentrant {
    address sender = _msgSender();

    require(isWhitelistActive, "Sale is closed");
    require(_verifyWhitelist(merkleProof, sender), "Invalid proof");
    require(msg.value == whitelistPrice * amount, "Incorrect payable amount");
    require(!_alreadyWhitelistMinted[sender], "Already minted your Whitelist Spot");

    _alreadyWhitelistMinted[sender] = true;
    _internalMint(sender, amount);
  }


  function freeMint(
    bytes32[] calldata merkleProof
    ) public payable nonReentrant {
    address sender = _msgSender();

    require(isFreemintActive, "Sale is closed");
    require(_verifyFreemint(merkleProof, sender), "Invalid proof");
    require(!_alreadyMinted[sender], "Already minted your Free Mint");
    _alreadyMinted[sender] = true;
    _internalMint(sender, 1);
  }

  function mint(
    uint256 amount
    ) public payable nonReentrant {
      address sender = _msgSender();

      require(isMintActive, "Sale is closed");
      require(msg.value == price * amount, "Incorrect payable amount");

      _internalMint(sender, amount);
    }

  function ownerMint(address to, uint256 amount) public onlyOwner {
    _internalMint(to, amount);
  }

  function withdraw() public onlyOwner {
    payable(beneficiary).transfer(address(this).balance);
  }

  // Private

  function _internalMint(address to, uint256 amount) private {
    require(_currentId + amount <= MAX_SUPPLY, "Will exceed maximum supply");

    for (uint256 i = 1; i <= amount; i++) {
      _currentId++;
      _safeMint(to, _currentId);
    }
  }

  function _verifyWhitelist(
    bytes32[] calldata merkleProof,
    address sender
    /* uint256 maxAmount */
  ) private view returns (bool) {
    bytes32 leaf = keccak256(abi.encodePacked(sender));
    return MerkleProof.verify(merkleProof, merkleRootWhitelist, leaf);
  }

  function _verifyFreemint(
    bytes32[] calldata merkleProof,
    address sender
    /* uint256 maxAmount */
  ) private view returns (bool) {
    bytes32 leaf = keccak256(abi.encodePacked(sender));
    return MerkleProof.verify(merkleProof, merkleRootFreemint, leaf);
  }
  // ERC165

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, IERC165, ERC721Enumerable) returns (bool) {
    return interfaceId == type(IERC2981).interfaceId || super.supportsInterface(interfaceId);
  }

  // IERC2981

  function royaltyInfo(uint256 _tokenId, uint256 _salePrice) external view returns (address, uint256 royaltyAmount) {
    _tokenId; // silence solc warning
    royaltyAmount = (_salePrice / 100) * 3;
    return (royalties, royaltyAmount);
  }

  // ERC721Enumerable
    function _beforeTokenTransfer(
      address from,
      address to,
      uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
      super._beforeTokenTransfer(from, to, tokenId);
  }
}
